import { Button, Card, Checkbox, FormLayout, Layout, MediaCard, Pagination, Select, TextField, VideoThumbnail, Toast, Tag, Stack, Banner, Link, ButtonGroup } from '@shopify/polaris';
import axios from 'axios';
import React, { Component } from 'react';
import pixelImg0 from '../../assets/images/pixel-type-0.png';
import pixelImg1 from '../../assets/images/pixel-type-1.png';
import config from '../../config/config';
import { Provider, ResourcePicker } from '@shopify/app-bridge-react';
import moreAppConfig from '../../config/moreAppConfig';

const TitleErrorMessage = 'Title is required.';
const IDErrorMessage = 'Pixel ID is required.';
const TokenAccessErrorMessage = 'Token access is required.';
const configResourcePicker = { apiKey: config.apiKey, shopOrigin: config.shop };
class CreatePixel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isCAPI: false,
            // validTitle: '',
            // validID: '',
            // title: '',
            // id: '',
            // tokenAccess: '',
            // testCode: '',
            // listProduct: [],
            // listCollection: [],
            // target: 'All',
            // isEnable: true,
            // alert: null,
            // isOpenProductPicker: false,
            // isOpenCollectionPicker: false,
            // selectedProductID: [],
            // selectedProductName: [],
            // selectedCollectionID: [],
            // selectedCollectionName: [],
            // listTagProduct: [],
            // listTagCollection: [],
            isCAPI: this.props.pixelEdit == undefined ? false : this.props.pixelEdit.IsEnableConversationAPI,
            validTitle: '',
            validID: '',
            validTokenAccess: '',
            title: this.props.pixelEdit == undefined ? '' : this.props.pixelEdit.Title,
            pixelID: this.props.pixelEdit == undefined ? 0 : this.props.pixelEdit.ID,
            id: this.props.pixelEdit == undefined ? '' : this.props.pixelEdit.FacebookPixel,
            tokenAccess: this.props.pixelEdit == undefined ? '' : this.props.pixelEdit.TokenAccess,
            testCode: this.props.pixelEdit == undefined ? '' : this.props.pixelEdit.TestCode,
            listProduct: (this.props.pixelEdit != undefined && this.props.pixelEdit.LstProduct != null) ? this.props.pixelEdit.LstProduct.split(',') : [],
            listCollection: (this.props.pixelEdit != undefined && this.props.pixelEdit.LstCollect != null) ? this.props.pixelEdit.LstCollect.split(',') : [],
            target: this.props.pixelEdit == undefined ? 'All' : this.props.pixelEdit.Target,
            isEnable: this.props.pixelEdit == undefined ? true : this.props.pixelEdit.Status,
            alert: null,
            isOpenProductPicker: false,
            isOpenCollectionPicker: false,
            selectedProductID: (this.props.pixelEdit != undefined && this.props.pixelEdit.LstProduct != null) ? this.props.pixelEdit.LstProduct.split(',').map(p => ({ id: ('gid://shopify/Product/' + p) })) : [],
            selectedProductName: (this.props.pixelEdit != undefined && this.props.pixelEdit.ListProductName != null) ? this.props.pixelEdit.ListProductName.split('|||') : [],
            selectedCollectionID: (this.props.pixelEdit != undefined && this.props.pixelEdit.LstCollect != null) ? this.props.pixelEdit.LstCollect.split(',').map(p => ({ id: ('gid://shopify/Collection/' + p) })) : [],
            selectedCollectionName: (this.props.pixelEdit != undefined && this.props.pixelEdit.ListCollectionName != null) ? this.props.pixelEdit.ListCollectionName.split('|||') : [],

            listTagProduct: (this.props.pixelEdit != undefined && this.props.pixelEdit.ListProductName != null) ? this.props.pixelEdit.ListProductName.split('|||').map((pro, index) => {
                return <Tag key={'gid://shopify/Product/' + (this.props.pixelEdit.LstProduct == null ? '' : (this.props.pixelEdit.LstProduct.split(',').length > index ? this.props.pixelEdit.LstProduct.split(',')[index] : ''))} onRemove={() => this.handleRemoveTagProduct({ id: 'gid://shopify/Product/' + (this.props.pixelEdit.LstProduct == null ? '' : (this.props.pixelEdit.LstProduct.split(',').length > index ? this.props.pixelEdit.LstProduct.split(',')[index] : '')) })}>{pro}</Tag>;
            }) : [],
            listTagCollection: (this.props.pixelEdit != undefined && this.props.pixelEdit.ListCollectionName != null) ? this.props.pixelEdit.ListCollectionName.split('|||').map((pro, index) => {
                return <Tag key={'gid://shopify/Collection/' + (this.props.pixelEdit.LstCollect == null ? '' : (this.props.pixelEdit.LstCollect.split(',').length > index ? this.props.pixelEdit.LstCollect.split(',')[index] : ''))} onRemove={() => this.handleRemoveTagCollection({ id: 'gid://shopify/Collection/' + (this.props.pixelEdit.LstCollect == null ? '' : (this.props.pixelEdit.LstCollect.split(',').length > index ? this.props.pixelEdit.LstCollect.split(',')[index] : '')) })}>{pro}</Tag>;
            }) : [],
            isLoadingButton: false,
            limitViewMore: 10,
            selectedMedia: 0,
            listMedia: [
                {
                    title: 'How to get the FB Access Token?',
                    description: `To create a Facebook Pixel, you need access to Facebook Business Manager for your online store...`,
                    link: moreAppConfig.linkVideo.howGetTokenAccess,
                    image: moreAppConfig.linkImageVideo.howGetTokenAccess
                },
                {
                    title: 'How to TEST Facebook Conversion API (CAPI) Events?',
                    description: `Test CAPI Events inside your Events Manager, learn about deduplication and how to check if the Event ID is unique...`,
                    link: moreAppConfig.linkVideo.howTestCAPI,
                    image: moreAppConfig.linkImageVideo.howTestCAPI
                }
            ]
        }
        this.handleIDChange = this.handleIDChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleTargetChange = this.handleTargetChange.bind(this);

        this.handelClickSelectProduct = this.handelClickSelectProduct.bind(this);
        this.handleCancelProduct = this.handleCancelProduct.bind(this);
        this.handleRemoveTagProduct = this.handleRemoveTagProduct.bind(this);
        this.handleSelectProduct = this.handleSelectProduct.bind(this);
        this.handleClickViewMore = this.handleClickViewMore.bind(this);

        this.handelClickSelectCollection = this.handelClickSelectCollection.bind(this);
        this.handleCancelCollection = this.handleCancelCollection.bind(this);
        this.handleRemoveTagCollection = this.handleRemoveTagCollection.bind(this);
        this.handleSelectCollection = this.handleSelectCollection.bind(this);

        this.savePixel = this.savePixel.bind(this);
        this.handleTokenAccessChange = this.handleTokenAccessChange.bind(this);
        this.handleTestCodeChange = this.handleTestCodeChange.bind(this);

    }

    onclickChooseCAPI = (isCAPI, element) => {
        this.setState({ isCAPI: isCAPI });
    }

    toggleActive = () => {
        this.setState({ alert: null });
    }

    handleTokenAccessChange = (e) => {
        debugger;
        this.setState({ tokenAccess: e, validTokenAccess: e === '' ? TokenAccessErrorMessage : '' });
    }

    handleTestCodeChange = (e) => {
        this.setState({ testCode: e });
    }

    savePixel = () => {
        debugger;
        this.setState({ isLoadingButton: true });
        const that = this;
        let isvalid = true;
        let isCAPIpost = this.state.isCAPI;
        if (this.props.setting.PlanNumber != 2 && this.props.setting.PlanNumber != 4) {
            isCAPIpost = false;
        }
        if (this.state.id == '') {
            this.setState({ validID: IDErrorMessage });
            isvalid = false;
        }
        if (this.state.title == '') {
            this.setState({ validTitle: TitleErrorMessage });
            isvalid = false;
        }
        if ((this.state.tokenAccess == '' || this.state.tokenAccess == null) && isCAPIpost) {
            this.setState({ validTokenAccess: TokenAccessErrorMessage });
            isvalid = false;
        }
        if (isvalid) {
            let listProductId = this.state.selectedProductID.map(p => p.id.replace('gid://shopify/Product/', ''));
            let listCollectionId = this.state.selectedCollectionID.map(p => p.id.replace('gid://shopify/Collection/', ''));
            let data = {
                ID: this.state.pixelID,
                Title: this.state.title,
                FacebookPixel: this.state.id,
                Target: this.state.target,
                ShopID: this.props.shop.ID,
                Status: this.state.isEnable,
                TokenAccess: this.state.tokenAccess,
                TestCode: this.state.testCode,
                IsEnableConversationAPI: isCAPIpost,
                LstProduct: listProductId == undefined ? '' : listProductId.join(','),
                ListProductName: this.state.selectedProductName == undefined ? '' : this.state.selectedProductName.join('|||'),
                LstCollect: listCollectionId == undefined ? '' : listCollectionId.join(','),
                ListCollectionName: this.state.selectedCollectionName == undefined ? '' : this.state.selectedCollectionName.join('|||'),
                IsFirstCreate: false,
            }
            axios.post(config.rootLink + '/FrontEnd/CreatePixel', data)
                .then(function (response) {
                    // handle success
                    if (response.data != null) {
                        debugger;
                        if (response.data.IsSuccess) {
                            if (that.state.pixelID == 0){
                                that.props.callbackSavePixelSuccess();
                            }
                            else{
                                that.props.callbackSelectedTabChange(1);
                            }
                           
                            that.setState({ isLoadingButton: false });
                        }
                        else {
                            if (response.data.Messenger == 'Plan') {
                                that.props.callbackSelectedTabChange(3);
                            }
                            else {
                                that.setState({ alert: <Toast content={response.data.Messenger} onDismiss={that.toggleActive} />, isLoadingButton: false });
                            }
                        }
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        else {
            this.setState({ isLoadingButton: false });

        }

    }

    handleIDChange = (e) => {
        debugger;
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex

        if (e === '' || re.test(e)) {
            this.setState({ id: e, validID: e === '' ? IDErrorMessage : '' });
        }

    }

    handleStatusChange = (e) => {
        this.setState({ isEnable: e });
    }

    handleTitleChange = (e) => {
        debugger;
        this.setState({ title: e, validTitle: e === '' ? TitleErrorMessage : '' });
    }
    handleTargetChange = (e) => {
        this.setState({ target: e });
    }
    handelClickSelectProduct = () => {
        this.setState({ isOpenProductPicker: true });
    }
    handleCancelProduct = () => {
        this.setState({ isOpenProductPicker: false });
    }
    handleRemoveTagProduct = (pro) => {
        debugger;
        const index = this.state.selectedProductID.map(p => p.id).indexOf(pro.id);
        if (index > -1) {
            this.setState({
                selectedProductID: this.state.selectedProductID.filter(p => this.state.selectedProductID.indexOf(p) != index),
                selectedProductName: this.state.selectedProductName.filter(p => this.state.selectedProductName.indexOf(p) != index),
                listTagProduct: this.state.listTagProduct.filter(p => this.state.listTagProduct.indexOf(p) != index),
            });
        }
    }
    handleSelectProduct = (selectPayload) => {
        this.setState(
            {
                selectedProductID: selectPayload.selection.map((pro) => {
                    return { id: pro.id };//.replace('gid://shopify/Product/','')
                }),
                selectedProductName: selectPayload.selection.map((pro) => {
                    return pro.title;
                }),
                listTagProduct: selectPayload.selection.map((pro) => {
                    return <Tag key={pro.id} onRemove={() => this.handleRemoveTagProduct(pro)}>{pro.title}</Tag>;
                }),
                isOpenProductPicker: false,
                limitViewMore: 10
            }
        )
    }

    handelClickSelectCollection = () => {
        this.setState({ isOpenCollectionPicker: true });
    }
    handleCancelCollection = () => {
        this.setState({ isOpenCollectionPicker: false });
    }
    handleRemoveTagCollection = (col) => {
        debugger;
        const index = this.state.selectedCollectionID.map(p => p.id).indexOf(col.id);
        if (index > -1) {
            this.setState({
                selectedCollectionID: this.state.selectedCollectionID.filter(p => this.state.selectedCollectionID.indexOf(p) != index),
                selectedCollectionName: this.state.selectedCollectionName.filter(p => this.state.selectedCollectionName.indexOf(p) != index),
                listTagCollection: this.state.listTagCollection.filter(p => this.state.listTagCollection.indexOf(p) != index),
            });
        }
    }
    handleSelectCollection = (selectPayload) => {
        debugger;
        this.setState(
            {
                selectedCollectionID: selectPayload.selection.map((col) => {
                    return { id: col.id };//.replace('gid://shopify/Collection/','')
                }),
                selectedCollectionName: selectPayload.selection.map((col) => {
                    return col.title;
                }),
                listTagCollection: selectPayload.selection.map((col) => {
                    return <Tag key={col.id} onRemove={() => this.handleRemoveTagCollection(col)}>{col.title}</Tag>;
                }),
                isOpenCollectionPicker: false,
                limitViewMore: 10
            }
        )
    }
    handleClickViewMore = () => {
        this.setState({ limitViewMore: 20000000 });
    }

    render() {
        return (
            <Layout>
                <Layout.Section>
                    <Card>
                        <Card.Section>
                            <FormLayout>
                                <TextField

                                    onChange={this.handleTitleChange}
                                    label={<>Facebook Pixel Title <span className={"risk-text"}>(*)</span></>}
                                    helpText={"It helps you to do easily management facebook pixel"}
                                    type="text"
                                    error={this.state.validTitle}
                                    value={this.state.title}
                                />
                                <TextField
                                    onChange={this.handleIDChange}
                                    label={<>Facebook Pixel ID <span className={"risk-text"}>(*)</span></>}
                                    labelAction={{ content: 'Where can I get it?', onAction: () => { window.open(moreAppConfig.linkVideo.whereGetPixelID, '_blank').focus(); } }}
                                    type="text"
                                    error={this.state.validID}
                                    value={this.state.id}
                                />
                                <div style={{ marginTop: '20px' }}>
                                    <ButtonGroup segmented>
                                        <Button primary={!this.state.isCAPI} onClick={() => { this.setState({ isCAPI: false }) }} >Browser</Button>
                                        <Button primary={this.state.isCAPI} onClick={() => { this.setState({ isCAPI: true }) }}>Conversions API</Button>
                                    </ButtonGroup>
                                    {/* <img src={pixelImg0} width={'150'} className={this.state.isCAPI ? 'img-capi' : 'img-capi-selected'} onClick={() => { this.setState({ isCAPI: false }) }} />
                                    <img src={pixelImg1} width={'150'} className={!this.state.isCAPI ? 'img-capi' : 'img-capi-selected'} onClick={() => { this.setState({ isCAPI: true }) }} /> */}
                                </div>
                                <p>
                                    {!this.state.isCAPI ? `Standard uses Facebook Pixel, a third-party cookie that collects and shares customers’ browsing behavior on your online store.
                                    Browser-based ad blockers can prevent the pixel from collecting data.`: `Maximum combines all data-sharing options to reach the highest amount of customers. 
                                    It uses Conversions API, which shares data directly from our servers to Facebook. This means the data can’t be blocked by ad blockers, IOS 14+`}

                                </p>
                                {!this.state.isCAPI ? (<> </>) : ((this.props.setting.PlanNumber == 2 || this.props.setting.PlanNumber == 4) ? (
                                    <>
                                        <TextField type="text"
                                            label={<>Facebook Pixel Access Token <span className={"risk-text"}>(*)</span></>}
                                            value={this.state.tokenAccess}
                                            onChange={this.handleTokenAccessChange}
                                            labelAction={{ content: 'Where can I get it?', onAction: () => { window.open(moreAppConfig.linkVideo.whereGetTokenAccess, '_blank').focus(); } }}
                                            error={this.state.validTokenAccess}
                                        />
                                        <TextField type="text" label="Test Code Event"
                                            onChange={this.handleTestCodeChange}
                                            value={this.state.testCode}
                                            helpText={<>You can check if all your events are received correctly by Test Event Code. <span className={"risk-text"}>When you are ready, you can remove the Test Event Code.</span></>}
                                            labelAction={{ content: 'Where can I get it?', onAction: () => { window.open(moreAppConfig.linkVideo.whereGetTestCode, '_blank').focus(); } }} />
                                    </>

                                ) : (<>
                                    <Banner
                                        title="Upgrade Plan"
                                        status="info"
                                    >
                                        <p>
                                            This feature requires an upgrade. To continue this feature please upgrade <Link onClick={() => { this.props.callbackSelectedTabChange(3); }} >plan here</Link>
                                        </p>
                                    </Banner>
                                </>))}
                                <Select
                                    label="Target"
                                    options={[
                                        { label: 'Entire Store', value: 'All' },
                                        { label: 'Products', value: 'Product' },
                                        { label: 'Collections', value: 'Collection' },
                                    ]}
                                    value={this.state.target}
                                    onChange={this.handleTargetChange}
                                />

                                {this.state.target == 'Product' ? (
                                    <div style={{ paddingTop: '20px' }}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Stack spacing="tight">{this.state.listTagProduct.length > this.state.limitViewMore ? (
                                                [this.state.listTagProduct.slice(0, this.state.limitViewMore), <Tag key={'viewmore'} onClick={this.handleClickViewMore}>View more {this.state.listTagProduct.length - this.state.limitViewMore} item(s)</Tag>]
                                            ) : (this.state.listTagProduct)}</Stack>

                                        </div>
                                        <Button onClick={this.handelClickSelectProduct}>Select Products</Button>

                                        <Provider config={configResourcePicker}>
                                            <ResourcePicker resourceType="Product" open={this.state.isOpenProductPicker}
                                                onSelection={this.handleSelectProduct}
                                                onCancel={this.handleCancelProduct}
                                                showVariants={false}
                                                initialSelectionIds={this.state.selectedProductID} />
                                        </Provider>
                                    </div>
                                ) : (<></>)}
                                {this.state.target == 'Collection' ? (
                                    <div style={{ paddingTop: '20px' }}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Stack spacing="tight">{this.state.listTagCollection.length > this.state.limitViewMore ? (
                                                [this.state.listTagCollection.slice(0, this.state.limitViewMore), <Tag key={'viewmore'} onClick={this.handleClickViewMore}>View more {this.state.listTagCollection.length - this.state.limitViewMore} item(s)</Tag>]
                                            ) : (this.state.listTagCollection)}</Stack>

                                        </div>
                                        <Button onClick={this.handelClickSelectCollection}>Select Collections</Button>

                                        <Provider config={configResourcePicker}>
                                            <ResourcePicker resourceType="Collection" open={this.state.isOpenCollectionPicker}
                                                onSelection={this.handleSelectCollection}
                                                onCancel={this.handleCancelCollection}
                                                initialSelectionIds={this.state.selectedCollectionID} />
                                        </Provider>
                                    </div>
                                ) : (<></>)}

                                <Checkbox
                                    label="Enable"
                                    checked={this.state.isEnable}
                                    onChange={this.handleStatusChange}
                                />
                                {this.state.alert}
                                <div className={'card-button'}>
                                    <Button primary onClick={this.savePixel} loading={this.state.isLoadingButton}>Save</Button>
                                </div>
                            </FormLayout>
                        </Card.Section>

                    </Card >

                </Layout.Section >
                <Layout.Section secondary>
                    {!this.state.isCAPI ? (<></>) : (
                        <Card title={'More tips on getting started'}>
                            <Card.Section>
                                <p>
                                    This is series introduce Facebook Conversion API
                                </p>
                                <div style={{ marginTop: '20px' }}>
                                    <MediaCard
                                        title={this.state.listMedia[this.state.selectedMedia].title}
                                        primaryAction={{
                                            content: 'Learn more',
                                            onAction: () => { window.open(this.state.listMedia[this.state.selectedMedia].link, '_blank').focus(); },
                                        }}
                                        description={this.state.listMedia[this.state.selectedMedia].description}
                                        popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                                    >
                                        <VideoThumbnail
                                            videoLength={80}
                                            onClick={() => { window.open(this.state.listMedia[this.state.selectedMedia].link, '_blank').focus(); }}
                                            thumbnailUrl={this.state.listMedia[this.state.selectedMedia].image}
                                        />
                                    </MediaCard>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <Pagination
                                        label={`${this.state.selectedMedia + 1}/${this.state.listMedia.length}`}
                                        hasPrevious
                                        onPrevious={() => {
                                            if (this.state.selectedMedia > 0) {
                                                this.setState({ selectedMedia: this.state.selectedMedia - 1 });
                                            }
                                        }}
                                        hasNext
                                        onNext={() => {
                                            if (this.state.selectedMedia < this.state.listMedia.length - 1) {
                                                this.setState({ selectedMedia: this.state.selectedMedia + 1 });
                                            }
                                        }}
                                    />
                                    <span></span>
                                </div>

                            </Card.Section>
                        </Card>
                    )}
                </Layout.Section>
            </Layout >
        );
    }
}

export default CreatePixel;