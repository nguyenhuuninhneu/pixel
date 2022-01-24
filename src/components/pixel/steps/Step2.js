import { Layout, ResourceList, Card, ResourceItem, Icon, TextStyle, ProgressBar, Checkbox, Button, MediaCard, VideoThumbnail, Banner, Form, FormLayout, Toast, Frame, CalloutCard, ButtonGroup } from '@shopify/polaris';
import React, { Component } from 'react';
import config from '../../../config/config';
import moreAppConfig from '../../../config/moreAppConfig';
import {
    CircleTickMajor
} from '@shopify/polaris-icons';
import step from '../../../assets/images/step.png';
import axios from 'axios';

class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDone: false,
            alert: null,
            isComplete: false,
            isLoadingSave : false
        }
        this.handleDoneChange = this.handleDoneChange.bind(this);
        this.completeStepSetup = this.completeStepSetup.bind(this);
    }

    handleDoneChange = (e) => {
        debugger;
        this.setState({ isDone: e });
    }

    toggleActive = () => {
        this.setState({ alert: null });
    }

    completeStepSetup = () => {
        debugger;
        this.setState({isLoadingSave : true});
        const that = this;
        if (this.state.isDone) {
            axios.post(config.rootLink + '/FrontEnd/CreatePixel', this.props.shop.pixelStepSetup)
                .then(function (response) {
                    // handle success
                    if (response.data != null) {
                        debugger;
                        if (response.data.IsSuccess) {
                            axios.post(config.rootLink + '/FrontEnd/CompleteStepSetup', { ShopID: that.props.shop.ID })
                                .then(function (response1) {
                                    // handle success
                                    that.setState({isLoadingSave : false});
                                    that.props.callbackStepSetupChange(3);
                                    
                                })
                                .catch(function (error) {
                                    // handle error
                                    console.log(error);
                                    that.setState({isLoadingSave : false});
                                });
                        }
                        else {
                            that.setState({ alert: <Toast content={response.data.Messenger} onDismiss={that.toggleActive} /> });
                            that.setState({isLoadingSave : false});
                        }
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });

        }
        else {
            this.setState({ alert: <Toast content={'Please tick the checkbox!'} onDismiss={this.toggleActive}></Toast> })
        }
    }

    render() {
        return (
            <Frame>
                <Layout>
                    <Layout.Section>
                        <div className={'step-setup'} style={{display : 'none'}}>
                            <CalloutCard
                                title="First things first, let's set up your pixel in 2 simple steps: "
                                illustration={step}
                                primaryAction={{
                                    id: 'btn-hidden',
                                    content: '',
                                    url: '',
                                }}
                            >
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[
                                        {
                                            id: 1,
                                            color:
                                            (this.props.shop.pixelStepSetup != undefined && this.props.shop.pixelStepSetup != null && this.props.shop.pixelStepSetup.Title != '' && this.props.shop.pixelStepSetup.FacebookPixel != '') ? 'highlight' : 'base',
                                            title: '1: Install your pixel',
                                        },
                                        {
                                            id: 2,
                                            color:
                                                this.state.isDone ? 'highlight' : 'base',
                                            title: '2: Remove your pixel from Shopify ',
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const { id, color, title } = item;

                                        return (
                                            <ResourceItem
                                                id={id}
                                                media={
                                                    <Icon source={CircleTickMajor} color={color} />
                                                }
                                                name={title}
                                                onClick={() => { this.props.callbackStepSetupChange(id - 1) }}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{title}</TextStyle>
                                                </h3>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                                <div style={{ marginTop: '30px' }}>
                                    <ProgressBar progress={((this.props.shop.pixelStepSetup != undefined && this.props.shop.pixelStepSetup != null && this.props.shop.pixelStepSetup.Title != '' && this.props.shop.pixelStepSetup.FacebookPixel != '') ? 50 : 0) +  (this.state.isDone ? 50 : 0)} />
                                </div>
                            </CalloutCard>

                        </div>


                    </Layout.Section>
                    <Layout.Section secondary>

                    </Layout.Section>
                    <Layout.Section>
                        <Card title={"Step 2: Remove your pixel from Shopify"} sectioned>
                            <div className={'banner-step2'}>
                                <Banner
                                    title="Important: Remove any pixels from your Shop Preferences."
                                    status="warning"
                                >
                                    <p>
                                        In your Shopify admin, click Online Store {'>'}  Preferences.
                                    </p>
                                    <p>
                                        Follow the video for details!
                                    </p>
                                </Banner>
                            </div>

                            <div style={{ paddingTop: '10px' }}>
                                <Form>
                                    <FormLayout>

                                        <Checkbox
                                            label="I've done this."
                                            checked={this.state.isDone}
                                            onChange={this.handleDoneChange}
                                        />
                                        <div className={'card-button'}>
                                            <ButtonGroup>
                                                <Button onClick={() => { this.props.callbackStepSetupChange(0) }}>Back</Button>
                                                <Button loading={this.state.isLoadingSave} primary disabled={!this.state.isDone || this.props.shop.pixelStepSetup == undefined || this.props.shop.pixelStepSetup == null || this.props.shop.pixelStepSetup.FacebookPixel == ''} onClick={this.completeStepSetup}>Save</Button>

                                            </ButtonGroup>
                                        </div>

                                    </FormLayout>
                                </Form>
                                {this.state.alert}

                            </div>

                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <MediaCard
                            title="How to remove your pixel from Shopify?"
                            primaryAction={{
                                content: 'Learn more',
                                onAction: () => { window.open(moreAppConfig.linkVideo.howToRemovePixel, '_blank').focus(); },
                            }}
                            description={`In your Shopify admin, click Online Store > Preferences.......`}
                            popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                        >
                            <VideoThumbnail
                                videoLength={80}
                                onClick={() => { window.open(moreAppConfig.linkVideo.howToRemovePixel, '_blank').focus(); }}
                                thumbnailUrl={moreAppConfig.linkImageVideo.howToRemovePixel}
                            />
                        </MediaCard>
                    </Layout.Section>
                </Layout>

            </Frame>
        );
    }
}

export default Step2;