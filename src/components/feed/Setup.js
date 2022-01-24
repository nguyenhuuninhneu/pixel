import React, { Component } from 'react';
import { Card, Link, Heading, Icon, Layout, Button, OptionList, FormLayout, TextField, Stack, RadioButton, Label, Banner, ProgressBar, Modal, Select, ContextualSaveBar, Toast, MediaCard, VideoThumbnail } from '@shopify/polaris'
import config from '../../config/config';
import allCategory from '../../config/category';
import {
    RefreshMajor, DuplicateMinor, ChevronRightMinor, CancelSmallMinor, CircleRightMajor
} from '@shopify/polaris-icons';
import Plan from './Plan';
import { Provider, ResourcePicker } from '@shopify/app-bridge-react';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';

const configResourcePicker = { apiKey: config.apiKey, shopOrigin: config.shop };
const getArrayCategoryById = (id) => {
    debugger;
    let result = [];
    while (allCategory.find(p => p.Id == id) != undefined) {
        let cat = allCategory.find(p => p.Id == id);
        result = [cat.Id, ...result];
        id = cat.ParentID;
    }
    switch (result.length) {
        case 0:
            result = [-1, -1, -1, -1];
            break; 
        case 1:
            result = [...result, -1, -1, -1];
            break;
        case 2:
            result = [...result, -1, -1];
            break;
        case 3:
            result = [...result, -1];
            break;
        default:
            break;
    }
    return {
        Category1: result[0],
        Category2: result[1],
        Category3: result[2],
        Category4: result[3],
    }
}
const getCategorybyArray = (arr) => {
    if (arr.Category4 > 0) {
        return arr.Category4;
    }
    if (arr.Category3 > 0) {
        return arr.Category3;
    }
    if (arr.Category2 > 0) {
        return arr.Category2;
    }
    if (arr.Category1 > 0) {
        return arr.Category1;
    }
    return -1;
}
const getCategoryOriginalNamebyArray = (arr) => {
    debugger;
    var id = 0;
    if (arr.Category4 > 0) {
        id = arr.Category4;
    }
    else if (arr.Category3 > 0) {
        id = arr.Category3;
    }
    else if (arr.Category2 > 0) {
        id = arr.Category2;
    }
    else if (arr.Category1 > 0) {
        id = arr.Category1;
    }
    var cat = allCategory.find(p => p.Id == id);
    return cat == undefined ? '' : cat.OriginalName;
}
class Setup extends Component {
    constructor(props) {
        super(props);
        debugger;
        this.state = {
            openModel: false,
            isOpenProductPicker: false,
            isOpenCollectionPicker: false,
            feed: {
                ...this.props.feed,
                selectedProductID: (this.props.feed != undefined && this.props.feed.LstProduct != null) ? this.props.feed.LstProduct.split(',').map(p => ({ id: ('gid://shopify/Product/' + p) })) : [],
                selectedProductName: (this.props.feed != undefined && this.props.feed.ListProductName != null) ? this.props.feed.ListProductName.split('|||') : [],
                selectedCollectionID: (this.props.feed != undefined && this.props.feed.LstCollection != null && this.props.feed.LstCollection != '') ? this.props.feed.LstCollection.split(',').map(p => ({ id: ('gid://shopify/Collection/' + p) })) : [],
                selectedCollectionName: (this.props.feed != undefined && this.props.feed.ListCollectionName != null && this.props.feed.ListCollectionName != '') ? this.props.feed.ListCollectionName.split('|||') : [],
            },
            listCategory: getArrayCategoryById(this.props.feed != undefined ? this.props.feed.FacebookCategory : 0),
            listCategorySearch: {
                Category1: '',
                Category2: '',
                Category3: '',
                Category4: '',
            },
            isOpenSelectFacebookCategory: false,
            selectedCollection: (this.props.feed != undefined && this.props.feed.MappingFacebookCategory != null) ? this.props.feed.MappingFacebookCategory.split(',').map(p => ({ collectionId: p.split('-')[0], facebookCategoryId: p.split('-')[1], facebookCategoryTitle: (allCategory.find(g => g.Id == p.split('-')[1]) != undefined ? allCategory.find(g => g.Id == p.split('-')[1]).OriginalName : '') })) : [{ collectionId: 0, facebookCategoryId: 0, facebookCategoryTitle: '' }],
            listAllCollection: [],
            listCategoryMapping: {
                Category1: -1,
                Category2: -1,
                Category3: -1,
                Category4: -1,
            },
            listCategoryMappingSearch: {
                Category1: '',
                Category2: '',
                Category3: '',
                Category4: '',
            },
            currentIndex: 0,
            isOpenSelectFacebookCategoryMapping: false,
            isOpenSaveToolbar: false,
            isLoadingSave: false,
            isSaveComplete: null,
            alert: null,
            validateName: null,
            validateCategory: null,
            isLoadingCreateFeed: false
        };
        if (!this.props.feed.IsFacebookCategorySelect) {
            this.getAllCollection();
        }

        //Loop check generating
        var that = this;
        setInterval(() => {
            if (this.props.feed.IsGenerating) {
                axios.post(config.rootLink + '/FrontEnd/CheckIsGenerating', { ShopID: this.props.shop.ID })
                    .then(function (response) {
                        // handle success
                        if (response.data != null && !response.data.IsGenerating) {
                            debugger;
                            that.props.AppCallbackFeedFuntion({
                                ...that.props.feed,
                                IsGenerating: response.data.IsGenerating,
                                NumberVariant: response.data.ItemCount,
                                LastRunTimeStr: response.data.LastUpdate
                            });
                            that.setState({
                                feed: {
                                    ...that.state.feed,
                                    IsGenerating: response.data.IsGenerating,
                                    NumberVariant: response.data.ItemCount,
                                    LastRunTimeStr: response.data.LastUpdate
                                }
                            });

                        }

                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            }

        }, 3000)
    }

    saveFeed = (stepSetup, isGenerate) => {
        debugger;
        if (this.state.feed.Name == '') {
            this.setState({
                validateName: 'Name is required.'
            })
        }
        else if (stepSetup > 2 && this.state.feed.IsFacebookCategorySelect && this.state.listCategory.Category1 == -1) {
            this.setState({
                validateCategory: 'Facebook Category is required.'
            })
        }
        else if (stepSetup > 2 && !this.state.feed.IsFacebookCategorySelect && (this.state.selectedCollection.filter(p => p.collectionId == 0 || p.facebookCategoryId == 0 || p.collectionId == true || p.collectionId == 'true').length > 0 || this.state.selectedCollection.filter(p => p.collectionId != 0 && p.facebookCategoryId != 0).length == 0)) {
            this.setState({
                validateCategory: 'Mapping Facebook Category is required.'
            })
        }
        else {
            this.setState({ isLoadingSave: true, isLoadingCreateFeed: true });
            let listProductId = this.state.feed.selectedProductID.map(p => p.id.replace('gid://shopify/Product/', ''));
            let listCollectionId = this.state.feed.selectedCollectionID.map(p => p.id.replace('gid://shopify/Collection/', ''));
            let listMapping = this.state.selectedCollection.filter(p => p.collectionId != 0 && p.facebookCategoryId != 0).map(p => p.collectionId + '-' + (p.facebookCategoryId == undefined ? '' : p.facebookCategoryId)).join(',');
            let data = {
                ID: this.state.feed.ID,
                ShopID: this.state.feed.ShopID,
                Name: this.state.feed.Name.trim(),
                Url: this.state.feed.Url,
                Schedule: this.props.feed.Schedule,
                LstProduct: listProductId == undefined ? '' : listProductId.join(','),
                ListProductName: this.state.selectedProductName == undefined ? '' : this.state.selectedProductName.join('|||'),
                LstCollection: listCollectionId == undefined ? '' : listCollectionId.join(','),
                ListCollectionName: this.state.selectedCollectionName == undefined ? '' : this.state.selectedCollectionName.join('|||'),

                IsProductSelect: this.state.feed.IsProductSelect,
                FacebookCategory: getCategorybyArray(this.state.listCategory),
                MappingFacebookCategory: listMapping,
                IsFacebookCategorySelect: this.state.feed.IsFacebookCategorySelect,
                PlanNumber: this.state.feed.PlanNumber,
                Status: this.state.feed.Status,
                NumberVariant: this.state.feed.NumberVariant,
                TotalVariant: this.state.feed.TotalVariant
            }
            let that = this;
            axios.post(config.rootLink + '/FrontEnd/SaveFeed', { data: data, StepSetup: stepSetup, isGenerate: isGenerate })
                .then(function (response) {
                    // handle success
                    if (response.data != null) {
                        debugger;
                        if (response.data.IsSuccess) {
                            that.setState({
                                isLoadingSave: false,
                                isOpenSaveToolbar: false,
                                isLoadingCreateFeed: false,
                                isSaveComplete: (stepSetup >= 3 && !isGenerate) ? <Toast content="Saved!" onDismiss={() => { that.setState({ isSaveComplete: null }) }} duration={4500} /> : null
                            });
                            that.props.AppCallbackFeedFuntion({
                                ...that.props.feed,
                                StepSetup: stepSetup
                            })

                        }
                        else {
                            that.setState({
                                isLoadingSave: false,
                                isOpenSaveToolbar: false,
                                isLoadingCreateFeed: false,
                                isSaveComplete: <Toast content={"Error! " + response.data.Message} onDismiss={() => { that.setState({ isSaveComplete: null }) }} duration={4500} />
                            });
                        }
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }

    }

    ReGenerate = () => {
        let that = this;
        axios.get(config.rootLink + '/FrontEnd/ReGenerating?ShopID=' + this.props.shop.ID)
            .then(function (response) {
                // handle success
                if (response.data != null) {
                    debugger;
                    if (response.data.IsSuccess) {

                        that.props.AppCallbackFeedFuntion({
                            ...that.props.feed,
                            IsGenerating: true
                        });
                        that.setState({
                            feed: {
                                ...that.state.feed,
                                IsGenerating: true
                            }
                        });

                    }
                    else {
                        that.setState({
                            isOpenSaveToolbar: false,
                            isSaveComplete: <Toast content={"Error!"} onDismiss={() => { that.setState({ isSaveComplete: null }) }} duration={4500} />
                        });
                    }
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    handleOpenFacebookCategoryMapping = (index) => {
        this.setState({
            listCategoryMapping: getArrayCategoryById(this.state.selectedCollection[index].facebookCategoryId),
            currentIndex: index,
            isOpenSelectFacebookCategoryMapping: true
        })
    }

    handleCloseSelectFacebookCategoryMapping = () => {
        debugger;
        var listtmp = this.state.selectedCollection;
        var facebookCategoryId = getCategorybyArray(this.state.listCategoryMapping);
        listtmp[this.state.currentIndex].facebookCategoryId = facebookCategoryId;
        listtmp[this.state.currentIndex].facebookCategoryTitle = (allCategory.find(p => p.Id == facebookCategoryId) != undefined ? allCategory.find(p => p.Id == facebookCategoryId).OriginalName : '');
        this.setState({
            selectedCollection: listtmp,
            isOpenSelectFacebookCategoryMapping: false,
            isOpenSaveToolbar: true,
            validateCategory: null
        })
    }

    handleOpenPlan = () => {
        this.setState({ openModel: true })
    }

    handleClosePlan = () => {
        this.setState({ openModel: false })
    }

    handleChangeSchedule = (schedule) => {
        if (this.props.feed.PlanNumber > 1) {
            this.setState({
                feed: {
                    ...this.state.feed,
                    Schedule: schedule,

                },
                isOpenSaveToolbar: true
            })
        }
        else {
            this.setState({ openModel: true })
        }

    }

    handleChangeName = (e) => {
        this.setState({
            feed: {
                ...this.state.feed,
                Name: (e).trimStart().substring(0, 149),

            },
            isOpenSaveToolbar: true,
            validateName: (e).trimStart() == '' ? 'Name is required.' : null
        })
    }

    handleChangeUrl = (e) => {
        this.setState({
            feed: {
                ...this.state.feed,
                Url: e,

            },
            isOpenSaveToolbar: true
        })
    }

    handleClickRefreshUrl = () => {

    }


    handleClickCopyUrl = () => {
        debugger;
        this.setState({ alert: <Toast content={"Copied!"} onDismiss={() => { this.setState({ alert: null }) }} duration={4500}></Toast> });
    }

    handleChangeProductSelect = (e) => {
        this.setState({
            feed: {
                ...this.state.feed,
                IsProductSelect: e
            },
            isOpenCollectionPicker: !e,
            isOpenSaveToolbar: true
        });
    }

    handleChangeFacebookCategorySelect = (e) => {
        this.setState({
            feed: {
                ...this.state.feed,
                IsFacebookCategorySelect: e,

            },
            isOpenSaveToolbar: true,
            validateCategory: null

        })
    }

    handleSelectProduct = (selectPayload) => {
        this.setState(
            {
                feed: {
                    ...this.state.feed,
                    selectedProductID: selectPayload.selection.map((pro) => {
                        return { id: pro.id };//.replace('gid://shopify/Product/','')
                    }),
                    selectedProductName: selectPayload.selection.map((pro) => {
                        return pro.title;
                    }),
                },
                isOpenProductPicker: false,
                isOpenSaveToolbar: true
            }
        )
    }

    handleCancelProduct = () => {
        this.setState({ isOpenProductPicker: false });
    }

    handleSelectCollection = (selectPayload) => {
        this.setState(
            {
                feed: {
                    ...this.state.feed,
                    selectedCollectionID: selectPayload.selection.map((col) => {
                        return { id: col.id };//.replace('gid://shopify/Collection/','')
                    }),
                    selectedCollectionName: selectPayload.selection.map((col) => {
                        return col.title;
                    }),
                    validateCategory: null
                },

                isOpenCollectionPicker: false,
                isOpenSaveToolbar: true
            }
        )
    }

    handleCancelCollection = () => {
        this.setState({ isOpenCollectionPicker: false });
    }

    handleChangeCateory = (type, CatId) => {
        switch (type) {
            case 1:
                this.setState({
                    listCategory: {
                        Category1: CatId,
                        Category2: -1,
                        Category3: -1,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true,
                    validateCategory: null
                });
                break;
            case 2:
                this.setState({
                    listCategory: {
                        ...this.state.listCategory,
                        Category2: CatId,
                        Category3: -1,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true,
                    validateCategory: null
                });
                break;
            case 3:
                this.setState({
                    listCategory: {
                        ...this.state.listCategory,
                        Category3: CatId,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true,
                    validateCategory: null
                });
                break;
            case 4:
                this.setState({
                    listCategory: {
                        ...this.state.listCategory,
                        Category4: CatId
                    },
                    isOpenSaveToolbar: true,
                    validateCategory: null
                });
                break;
            default:
                break;
        }
    }

    handleChangeCateoryMapping = (type, CatId) => {
        switch (type) {
            case 1:
                this.setState({
                    listCategoryMapping: {
                        Category1: CatId,
                        Category2: -1,
                        Category3: -1,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true
                });
                break;
            case 2:
                this.setState({
                    listCategoryMapping: {
                        ...this.state.listCategoryMapping,
                        Category2: CatId,
                        Category3: -1,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true
                });
                break;
            case 3:
                this.setState({
                    listCategoryMapping: {
                        ...this.state.listCategoryMapping,
                        Category3: CatId,
                        Category4: -1
                    },
                    isOpenSaveToolbar: true
                });
                break;
            case 4:
                this.setState({
                    listCategoryMapping: {
                        ...this.state.listCategoryMapping,
                        Category4: CatId
                    },
                    isOpenSaveToolbar: true
                });
                break;
            default:
                break;
        }
    }

    handleCloseSelectFacebookCategory = () => {
        this.setState({
            isOpenSelectFacebookCategory: false
        })
    }

    getAllCollection = () => {
        if (this.state.listAllCollection.length == 0) {
            var that = this;
            axios.get(config.rootLink + '/FrontEnd/GetAllCollection?id=' + this.props.shop.ID)
                .then(function (response) {
                    that.setState({
                        listAllCollection: [{ id: 0, title: 'Select Collection' }, ...response.data.collection, ...response.data.smartCollection]
                    })

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }

    }

    handleCollectionMappingChange = (index, e) => {
        debugger;
        if (this.state.selectedCollection.length == 0) {
            this.setState({
                selectedCollection: [{ collectionId: e, facebookCategoryId: 0, facebookCategoryTitle: '' }],
                isOpenSaveToolbar: true,
                validateCategory: null
            })
        }
        else {
            var listtmp = this.state.selectedCollection;
            listtmp[index].collectionId = e;
            this.setState({
                selectedCollection: listtmp,
                isOpenSaveToolbar: true,
                validateCategory: null
            })
        }
    }

    handleFacebookCategoryMappingChange = (index, e) => {
        if (this.state.selectedCollection.length == 0) {
            this.setState({
                selectedCollection: [{ collectionId: 0, facebookCategoryId: e, facebookCategoryTitle: (allCategory.find(p => p.Id == e) != undefined ? allCategory.find(p => p.Id == e).OriginalName : '') }],
                isOpenSaveToolbar: true,
                validateCategory: null

            })
        }
        else {
            var listtmp = this.state.selectedCollection;
            listtmp[index].facebookCategoryId = e;
            listtmp[index].facebookCategoryTitle = (allCategory.find(p => p.Id == e) != undefined ? allCategory.find(p => p.Id == e).OriginalName : '');
            this.setState({
                selectedCollection: listtmp,
                isOpenSaveToolbar: true,
                validateCategory: null
            })
        }
    }

    handleAddMoreMapping = () => {
        this.setState({
            selectedCollection: [...this.state.selectedCollection, { collectionId: 0, facebookCategoryId: 0, facebookCategoryTitle: '' }]
        })
    }



    render() {

        return (
            <div className={"orichi-feed"}>
                {(this.state.isOpenSaveToolbar && this.props.feed.StepSetup >= 3) ? <ContextualSaveBar
                    message="Unsaved changes"
                    saveAction={{
                        content: "Save",
                        onAction: () => { this.saveFeed(3, false) },
                        loading: this.state.isLoadingSave,
                    }}
                    discardAction={{
                        content: "Discard",
                        onAction: () => this.setState({ isOpenSaveToolbar: false }),
                    }}
                /> : <></>}
                {this.state.isSaveComplete}
                {this.state.alert}
                <Layout>
                    <Layout.Section>
                        <Card title="Set Up Feed"
                            primaryFooterAction={this.props.feed.StepSetup == 0 ? {
                                content: 'Next',
                                onAction: () => { this.saveFeed(1, false) }
                            } : null}
                            sectioned>
                            <FormLayout>
                                <TextField label="Feed Name"
                                    value={this.state.feed.Name}
                                    onChange={this.handleChangeName}
                                    error={this.state.validateName} />

                                <div className={"Polaris-Labelled__LabelWrapper"}>
                                    <div className={"Polaris-Label"}>
                                        <label className={"Polaris-Label__Text"}>Plan your submit feed schedule 👑</label>
                                    </div>
                                </div>
                                <Stack horizontal>
                                    <RadioButton
                                        label="Hourly"
                                        checked={this.state.feed.Schedule == 1}
                                        name="schedule"
                                        disabled={this.state.feed <= 1}
                                        onChange={() => { this.handleChangeSchedule(1) }}
                                    />
                                    <RadioButton
                                        label="Daily"
                                        name="schedule"
                                        checked={this.state.feed.Schedule == 2}
                                        disabled={this.state.feed <= 1}
                                        onChange={() => { this.handleChangeSchedule(2) }}
                                    />
                                    <RadioButton
                                        label="Weekly"
                                        name="schedule"
                                        checked={this.state.feed.Schedule == 3}
                                        disabled={this.state.feed <= 1}
                                        onChange={() => { this.handleChangeSchedule(3) }}
                                    />
                                </Stack>
                                <i>Select how often you want to submit feed and update feed URL</i>
                            </FormLayout>
                        </Card>
                        <div style={this.props.feed.StepSetup > 0 ? { marginTop: '1.6rem' } : { display: 'none' }}>
                            <Card title="Products Source"
                                primaryFooterAction={this.props.feed.StepSetup == 1 ? {
                                    content: 'Next',
                                    onAction: () => { this.saveFeed(2, false) }
                                } : null}
                                sectioned>
                                <FormLayout>
                                    <div className={"orichi-feed-radio orichi-feed-radio-product-select"}>
                                        <Stack horizontal>
                                            <RadioButton
                                                label={"All Products (" + (this.state.feed.TotalProduct) + " products)"}
                                                checked={this.state.feed.IsProductSelect}
                                                name="IsProductSelect"
                                                onChange={() => { this.handleChangeProductSelect(true) }}
                                                onFocus={() => { this.handleChangeProductSelect(true) }}
                                            />
                                            <div></div>
                                            {/* <Provider config={configResourcePicker}>
                                                <ResourcePicker resourceType="Product" open={this.state.isOpenProductPicker}
                                                    onSelection={this.handleSelectProduct}
                                                    onCancel={this.handleCancelProduct}
                                                    showVariants={false}
                                                    initialSelectionIds={this.state.feed.selectedProductID} />
                                            </Provider> */}

                                            <RadioButton
                                                label={"Collections (" + (this.state.feed.selectedCollectionID == null ? 0 : this.state.feed.selectedCollectionID.length) + " collections)"}
                                                name="IsProductSelect"
                                                checked={!this.state.feed.IsProductSelect}
                                                onChange={() => { this.handleChangeProductSelect(false) }}
                                                onFocus={() => { this.handleChangeProductSelect(false) }}
                                            />
                                            {config.admin == '1' ? <></> : <Provider config={configResourcePicker}>
                                                <ResourcePicker resourceType="Collection" open={this.state.isOpenCollectionPicker}
                                                    onSelection={this.handleSelectCollection}
                                                    onCancel={this.handleCancelCollection}
                                                    initialSelectionIds={this.state.feed.selectedCollectionID} />
                                            </Provider>}



                                        </Stack>
                                    </div>


                                    <p>All imported products will be sync to your feed</p>
                                </FormLayout>
                            </Card>
                        </div>

                        <div style={this.props.feed.StepSetup > 1 ? { marginTop: '1.6rem' } : { display: 'none' }}>
                            <Card title="Facebook Product Category"
                                primaryFooterAction={this.props.feed.StepSetup == 2 ? {
                                    content: 'Create Feed URL',
                                    loading: this.state.isLoadingCreateFeed,
                                    onAction: () => { this.saveFeed(3, true) }
                                } : null}

                                className={"orichi-feed-plan"} sectioned>
                                <FormLayout>
                                    <div className={"orichi-feed-radio"}>
                                        <Stack horizontal>
                                            <div onClick={() => {
                                                debugger;
                                                this.setState({
                                                    isOpenSelectFacebookCategory: true
                                                })
                                            }}>
                                                <RadioButton
                                                    label="Select Facebook Category"
                                                    checked={this.state.feed.IsFacebookCategorySelect}
                                                    name="IsFacebookCategorySelect"
                                                    onChange={() => { this.handleChangeFacebookCategorySelect(true) }}

                                                />
                                            </div>
                                            <div onClick={() => {
                                                debugger;
                                                this.getAllCollection();
                                            }}>
                                                <RadioButton
                                                    label="Mapping Facebook Category"
                                                    name="IsFacebookCategorySelect"
                                                    checked={!this.state.feed.IsFacebookCategorySelect}
                                                    onChange={() => { this.handleChangeFacebookCategorySelect(false) }}
                                                />
                                            </div>

                                        </Stack>
                                        <i>{this.state.feed.IsFacebookCategorySelect ? getCategoryOriginalNamebyArray(this.state.listCategory) : ''}</i>
                                    </div>
                                    {
                                        !this.state.feed.IsFacebookCategorySelect ? <div className={"orichi-feed-mapping-category"}>
                                            <table>
                                                <thead>
                                                    <tr key={'header'}>
                                                        <td style={{ width: '35%' }}><b>Collection from Product source</b></td>
                                                        <td style={{ width: '55%' }}><b>Mapping to Facebook Product Category</b></td>
                                                        <td style={{ width: '10%' }}></td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.selectedCollection.map((g, index) => (<tr key={index}>
                                                            <td style={{ width: '35%', position: "relative" }}>
                                                                <Select
                                                                    labelHidden
                                                                    options={this.state.listAllCollection.filter(p => p.id.toString() == g.collectionId.toString() || p.id == 0 || this.state.selectedCollection.map(p => p.collectionId.toString()).indexOf(p.id.toString()) < 0).map(p => ({ label: p.title, value: p.id.toString() }))}
                                                                    onChange={(e) => this.handleCollectionMappingChange(index, e)}
                                                                    value={g.collectionId.toString()}
                                                                />
                                                                <div className={"orichi-feed-mapping-category-icon"}>
                                                                    <Icon
                                                                        source={CircleRightMajor}
                                                                        color="base" />
                                                                </div>

                                                            </td>

                                                            <td style={{ width: '55%' }}>
                                                                <TextField
                                                                    labelHidden
                                                                    readOnly
                                                                    value={g.facebookCategoryTitle}
                                                                    onFocus={() => this.handleOpenFacebookCategoryMapping(index)}
                                                                    onChange={(e) => this.handleFacebookCategoryMappingChange(index, e)}
                                                                    placeholder="Select Facebook Category"
                                                                />
                                                            </td>
                                                            <td style={{ width: '10%' }}>
                                                                <Button onClick={() => {
                                                                    var listTmp = this.state.selectedCollection;
                                                                    listTmp.splice(index, 1);
                                                                    this.setState({
                                                                        selectedCollection: listTmp,
                                                                        isOpenSaveToolbar: true
                                                                    })
                                                                }}>
                                                                    <Icon
                                                                        source={CancelSmallMinor}
                                                                        color="base" />
                                                                </Button>
                                                            </td>
                                                        </tr>))

                                                    }
                                                </tbody>

                                            </table>
                                            {
                                                this.state.selectedCollection.length < this.state.listAllCollection.length - 1 ? <Link onClick={this.handleAddMoreMapping}>+ Add more mapping</Link> : <></>
                                            }

                                        </div> : <></>
                                    }
                                    <span style={{ color: 'red' }}>{this.state.validateCategory}</span>


                                </FormLayout>
                            </Card>
                        </div>

                        <div style={this.props.feed.StepSetup > 2 ? { marginTop: '1.6rem' } : { display: 'none' }}>
                            <Card title="Feed URL"
                                primaryFooterAction={this.state.feed.IsGenerating ? null : {
                                    content: 'Re-Generate',
                                    onAction: () => { this.ReGenerate() }
                                }}
                                sectioned>
                                <FormLayout>
                                    {this.props.feed.IsGenerating ?
                                        <Banner
                                            title="Processing"
                                            status="info"
                                            onDismiss={() => { }}
                                        >
                                            <p>We are generating XML feed for you. It will take few minutes based on total products you have in app. </p>
                                        </Banner>
                                        :
                                        <>
                                            <div className={"orichi-feed-url"}>
                                                <div className={"orichi-feed-url-input"}>
                                                    <TextField label="" readOnly value={this.state.feed.Url} onChange={this.handleChangeUrl} />

                                                </div>

                                                <div className={"orichi-feed-url-copy"}>
                                                    <CopyToClipboard text={this.state.feed.Url}
                                                        onCopy={this.handleClickCopyUrl}>
                                                        <Button><Icon
                                                            source={DuplicateMinor}
                                                            color="base" /></Button>
                                                    </CopyToClipboard>

                                                </div>

                                            </div>
                                            <div>
                                                <p style={{ marginTop: '10px' }}><b>Item Count:</b> {this.props.feed.NumberVariant}</p>
                                                <p style={{ marginTop: '10px' }}><b>Last Update on:</b> {this.props.feed.LastRunTimeStr}</p>
                                            </div>
                                        </>
                                    }


                                </FormLayout>
                            </Card>
                        </div>


                    </Layout.Section>
                    <Layout.Section secondary>
                        {this.props.feed.PlanNumber != 2 ?
                            <>
                                <Banner
                                    title={"YOU ARE ON THE " + (this.props.feed.PlanNumber == 0 ? "FREE" : "STANDARD") + " PLAN "}
                                    action={{ content: 'Go to Plan', onAction: () => { this.handleOpenPlan() } }}
                                    status="info"
                                    onDismiss={() => { }}
                                >
                                    <p>As a {this.props.feed.PlanNumber == 0 ? "free" : "standard"} user you can only create feed with a product limit of {this.props.feed.PlanNumber == 0 ? "50" : "1000"}. Also remember to upgrade to any of our Pro plans and increase your product limits.</p>
                                </Banner>
                                <Banner
                                    title="Resource remaining"
                                    status="info"
                                    onDismiss={() => { }}
                                >
                                    <div className={"orichi-feed-variant"}>

                                    </div>
                                    <Card title={'Variants Imported'} sectioned>

                                        <ProgressBar progress={this.state.feed.NumberVariant / this.state.feed.TotalVariant * 100} size="small" />
                                        <p>{this.state.feed.NumberVariant}/{this.state.feed.TotalVariant}</p>
                                    </Card>
                                </Banner>
                            </> : <></>}

                        <MediaCard
                            title={'How to feed product to the Facebook by Feed URL'}
                            primaryAction={{
                                content: 'Learn more',
                                onAction: () => { window.open('https://www.youtube.com/watch?v=YLknYGW6Cb8', '_blank').focus(); },
                            }}
                            description={''}
                            popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                        >
                            <VideoThumbnail
                                videoLength={80}
                                onClick={() => { window.open('https://www.youtube.com/watch?v=YLknYGW6Cb8', '_blank').focus(); }}
                                thumbnailUrl={'https://img.youtube.com/vi/YLknYGW6Cb8/maxresdefault.jpg'}
                            />
                        </MediaCard>

                    </Layout.Section>
                </Layout>
                <Modal
                    open={this.state.openModel}
                    title="Pricing"
                    large={true}
                    onClose={this.handleClosePlan}
                >
                    <Modal.Section>
                        <Plan shop={this.props.shop} setting={this.props.setting} feed={this.state.feed}></Plan>
                    </Modal.Section>
                </Modal>
                <div className={"orichi-feed-select-facebook-category"}>
                    <Modal
                        open={this.state.isOpenSelectFacebookCategory}
                        title="Select Facebook Category"
                        large={true}
                        primaryAction={{
                            content: 'Choose',
                            onAction: this.handleCloseSelectFacebookCategory,
                        }}
                        onClose={this.handleCloseSelectFacebookCategory}
                    >
                        <Modal.Section>
                            <Layout>
                                <Layout.Section secondary>

                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategorySearch.Category1}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategorySearch,
                                                        Category1: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>
                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == 0 && (this.state.listCategorySearch.Category1 == '' || p.Name.indexOf(this.state.listCategorySearch.Category1) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={<span>{cat.Name}</span>}
                                                                key={cat.Id}
                                                                checked={this.state.listCategory.Category1 == cat.Id}
                                                                name="Category1"
                                                                onChange={() => { this.handleChangeCateory(1, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>


                                    </div>


                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategorySearch.Category2}
                                            onChange={(e) => {
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategorySearch,
                                                        Category2: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>
                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategory.Category1 && (this.state.listCategorySearch.Category2 == '' || p.Name.indexOf(this.state.listCategorySearch.Category2) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={cat.Name}
                                                                key={cat.Id}

                                                                checked={this.state.listCategory.Category2 == cat.Id}
                                                                name="Category2"
                                                                onChange={() => { this.handleChangeCateory(2, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>

                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategorySearch.Category3}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategorySearch,
                                                        Category3: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>

                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategory.Category2 && (this.state.listCategorySearch.Category3 == '' || p.Name.indexOf(this.state.listCategorySearch.Category3) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={cat.Name}
                                                                key={cat.Id}

                                                                checked={this.state.listCategory.Category3 == cat.Id}
                                                                name="Category3"
                                                                onChange={() => { this.handleChangeCateory(3, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>

                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategorySearch.Category4}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategorySearch,
                                                        Category4: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>

                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategory.Category3 && (this.state.listCategorySearch.Category4 == '' || p.Name.indexOf(this.state.listCategorySearch.Category4) >= 0)).map((cat, index) => {
                                                        return <RadioButton
                                                            label={cat.Name}
                                                            key={cat.Id}

                                                            checked={this.state.listCategory.Category4 == cat.Id}
                                                            name="Category4"
                                                            onChange={() => { this.handleChangeCateory(4, cat.Id) }}
                                                        />
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>


                                </Layout.Section>
                            </Layout>
                        </Modal.Section>
                    </Modal>
                </div>

                <div className={"orichi-feed-select-facebook-category-mapping"}>
                    <Modal
                        open={this.state.isOpenSelectFacebookCategoryMapping}
                        title="Select Facebook Category"
                        large={true}
                        primaryAction={{
                            content: 'Choose',
                            onAction: this.handleCloseSelectFacebookCategoryMapping,
                        }}
                        onClose={this.handleCloseSelectFacebookCategoryMapping}
                    >
                        <Modal.Section>
                            <Layout>
                                <Layout.Section secondary>

                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategoryMappingSearch.Category1}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategoryMappingSearch,
                                                        Category1: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>
                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == 0 && (this.state.listCategoryMappingSearch.Category1 == '' || p.Name.indexOf(this.state.listCategoryMappingSearchch.Category1) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={<span>{cat.Name}</span>}
                                                                key={cat.Id}
                                                                checked={this.state.listCategoryMapping.Category1 == cat.Id}
                                                                name="Category1"
                                                                onChange={() => { this.handleChangeCateoryMapping(1, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>


                                    </div>


                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategoryMappingSearch.Category2}
                                            onChange={(e) => {
                                                this.setState({
                                                    listCategoryMappingSearch: {
                                                        ...this.state.listCategoryMappingSearch,
                                                        Category2: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>
                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategoryMapping.Category1 && (this.state.listCategoryMappingSearch.Category2 == '' || p.Name.indexOf(this.state.listCategoryMappingSearch.Category2) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={cat.Name}
                                                                key={cat.Id}

                                                                checked={this.state.listCategoryMapping.Category2 == cat.Id}
                                                                name="Category2"
                                                                onChange={() => { this.handleChangeCateoryMapping(2, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>

                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategoryMappingSearch.Category3}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategoryMappingSearch,
                                                        Category3: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>

                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategoryMapping.Category2 && (this.state.listCategoryMappingSearch.Category3 == '' || p.Name.indexOf(this.state.listCategoryMappingSearch.Category3) >= 0)).map((cat, index) => {
                                                        return <>
                                                            <RadioButton
                                                                label={cat.Name}
                                                                key={cat.Id}

                                                                checked={this.state.listCategoryMapping.Category3 == cat.Id}
                                                                name="Category3"
                                                                onChange={() => { this.handleChangeCateoryMapping(3, cat.Id) }}
                                                            />
                                                            {allCategory.filter(p => p.ParentID == cat.Id).length > 0 ? <Icon
                                                                source={ChevronRightMinor}
                                                                color="base" /> : <></>}
                                                        </>
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>

                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={'orichi-feed-select-facebook-category-item'}>
                                        <TextField
                                            labelHidden
                                            placeholder="Search..."
                                            value={this.state.listCategoryMappingSearch.Category4}
                                            onChange={(e) => {
                                                debugger;
                                                this.setState({
                                                    listCategorySearch: {
                                                        ...this.state.listCategoryMappingSearch,
                                                        Category4: e
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={'orichi-feed-select-facebook-category-item-list'}>

                                            <Stack vertical>
                                                {
                                                    allCategory.filter(p => p.ParentID == this.state.listCategoryMapping.Category3 && (this.state.listCategoryMappingSearch.Category4 == '' || p.Name.indexOf(this.state.listCategoryMappingSearch.Category4) >= 0)).map((cat, index) => {
                                                        return <RadioButton
                                                            label={cat.Name}
                                                            key={cat.Id}

                                                            checked={this.state.listCategoryMapping.Category4 == cat.Id}
                                                            name="Category4"
                                                            onChange={() => { this.handleChangeCateoryMapping(4, cat.Id) }}
                                                        />
                                                    }
                                                    )
                                                }

                                            </Stack>
                                        </div>

                                    </div>


                                </Layout.Section>
                            </Layout>
                        </Modal.Section>
                    </Modal>
                </div>

            </div>


        );
    }
}

export default Setup;