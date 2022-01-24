import { Badge, Banner, Button, Card, DataTable, EmptyState, Heading, Icon, Link, Modal, TextContainer, Toast } from '@shopify/polaris';
import axios from 'axios';
import React, { Component } from 'react';
import config from '../../config/config';
import IconButton from '@material-ui/core/IconButton';
import {
    DeleteMajor
} from '@shopify/polaris-icons';
import {
    EditMajor
} from '@shopify/polaris-icons';
import Loading from '../plugins/Loading';
import CreateSuccess from '../../assets/images/create-success.png'
import { TransferWithinAStationSharp } from '@material-ui/icons';

class ManagePixel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            IsOpen: false,
            currentPixel: null,
            alert: null,
            IsOpenSuccess: false
        }
        this.getPixelData = this.getPixelData.bind(this);
        if (this.props.shop.ID != undefined) {
            this.getPixelData(false);
        }


    }

    toggleActive = () => {
        this.setState({ alert: null });
    }

    getPixelData = (isDelete) => {
        var that = this;
        var date = Date.now();
        axios.get(config.rootLink + '/FileJson/' + this.props.shop.ID + '/Pixel' + this.props.shop.ID + '.json?v=' + date)
            .then(function (response) {
                debugger;
                if (response.data != null) {
                    that.setState({ data: response.data });
                    that.props.AppCallbackPixelCountFunction(response.data.length);
                    if (response.data.length == 0 && isDelete) {
                        that.props.callbackStepSetupChange(4);
                        that.props.callbackSelectedTabChange(0);
                    }
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    handleDeleteButtonClick = (pixel) => {
        this.setState({ IsOpen: true, currentPixel: pixel });
    }

    handleDeletePixel = () => {
        var that = this;
        if (this.state.currentPixel != null) {
            axios.post(config.rootLink + '/FrontEnd/DeletePixel', { id: this.state.currentPixel.ID, ShopID: this.props.shop.ID })
                .then(function (response) {
                    if (response.data.IsSuccess) {
                        that.getPixelData(true);
                        that.setState({ alert: <Toast content={'The pixel ID: ' + that.state.currentPixel.Title + ' deleted successfully'} onDismiss={that.toggleActive} />, IsOpen: false });
                    }
                    else {
                        that.setState({ alert: <Toast content={response.data.Messenger} onDismiss={that.toggleActive} />, IsOpen: false });
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }

    }

    render() {
        return (
            <>
               
                
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <Button primary onClick={() => { this.props.AppCallbackCheckPlanCreatePixelFunction() }}>Add Facebook Pixel</Button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    {(this.state.data != null && this.state.data.length > 0 && this.state.data.filter(p => p.IsEnableConversationAPI).length == 0) ?
                        <Banner
                            title=""
                            status="info"
                        >
                            <b>
                                Please setup the Facebook Conversion API by clicking the edit button. It is the best solution for the IOS 14+ update
                            </b>
                        </Banner>
                        : <></>}

                </div>

                <Card>
                    {(this.state.data == null) ? (<Loading />) : (this.state.data.length == 0 ? (
                        <EmptyState
                            heading="Manage your Facebook Pixels"
                            action={{ content: 'Add Facebook Pixel', onAction: () => { this.props.AppCallbackCheckPlanCreatePixelFunction() } }}
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            <p>You don't have any Facebook Pixels</p>
                        </EmptyState>
                    ) : (<div className={'table-pixel'}><DataTable id
                        columnContentTypes={[
                            'text',
                            'text',
                            'text',
                            'text',
                            'text',
                        ]}
                        headings={[
                            'Facebook Pixel',
                            'Target',
                            'Conversion API',
                            'Status',
                            'Action',
                        ]}
                        rows={this.state.data.map(p => [
                            <Link url="#" removeUnderline={true}>{(p.Title == null || p.Title == '') ? p.FacebookPixel : p.Title}</Link>,
                            (p.Target == 'All' ? 'All Pages' : p.Target),
                            (p.IsEnableConversationAPI ? (<Badge status="success">CAPI</Badge>) : (<Badge>Browser</Badge>)),
                            (p.Status ? (<Badge status="success">Active</Badge>) : (<Badge status="warning" progress="incomplete">Disable</Badge>)),
                            <>
                                <IconButton onClick={() => { this.props.callbackSelectedTabCreateChange(0, p) }}>
                                    <Icon
                                        source={EditMajor}
                                        color="base" />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => { this.handleDeleteButtonClick(p) }}>
                                    <Icon
                                        source={DeleteMajor}
                                        color="critical" />
                                </IconButton>
                            </>
                        ])}
                    /></div>))}
                    {this.state.alert}
                </Card>
                <Modal
                    open={this.state.IsOpen}
                    onClose={() => { this.setState({ IsOpen: false }) }}
                    title="Delete Facebook Pixel"
                    primaryAction={{
                        content: 'Ok',
                        onAction: this.handleDeletePixel,
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => { this.setState({ IsOpen: false }) },
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <p>
                                Do you want to delete "{this.state.currentPixel == null ? '' : this.state.currentPixel.Title}" pixel?
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
                <Modal
                    open={this.props.isCompleteSave && this.props.setting.ShowColumnTotal}
                    onClose={() => { this.props.AppCallbackWriteQuickReview(false) }}
                    title=""
                    primaryAction={{
                        content: 'Write a Quick Review',
                        onAction: () => { this.props.AppCallbackWriteQuickReview(true) },
                    }}
                    secondaryActions={[
                        {
                            content: 'Later',
                            onAction: () => { this.props.AppCallBackIsCompleteSave(false) },
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            <div className={"popup-create-pixel-success"}>
                                <img src={CreateSuccess} />
                                <Heading>The Pixel Created Successfully !!!</Heading>
                                <p>
                                    We will truly appreciate it if you could take a minute to leave us a review.
                                    Your review is our energy to move forward.

                                </p>
                            </div>

                        </TextContainer>
                    </Modal.Section>
                </Modal>

            </>

        );
    }
}

export default ManagePixel;