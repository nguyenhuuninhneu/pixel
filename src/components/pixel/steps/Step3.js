import { Layout, Card, Button, MediaCard, VideoThumbnail, ButtonGroup } from '@shopify/polaris';
import React, { Component } from 'react';
import finish from '../../../assets/images/finish.png';
import moreAppConfig from '../../../config/moreAppConfig';

class Step3 extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <Layout>
                    <Layout.Section>
                        <Card title="" sectioned>
                            <div className='step3' style={{ margin: "20px 10%" }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <h1 style={
                                        {
                                            fontSize: 20
                                        }
                                    }>Congratulations, you have saved successfully the pixel {this.props.pixelStepSetupName}!</h1>
                                    <div style={{ margin: "20px 0", textAlign: 'center' }}>
                                        <img width={'200'} src={finish}></img>
                                    </div>
                                    <p style={{ margin: "20px 0" }}><b>How do I know if Facebook Pixel is working?</b> </p>
                                    <p>Facebook Pixel Helper is a Google Chrome extension from Facebook that lets you test your pixel implementation.
                                        It is essentially a troubleshooting tool that tells you if all is well with your Facebook pixel.
                                        <a href={moreAppConfig.linkVideo.chromeExtension} target={'_blank'}><u> Install The Facebook Pixel Helper here</u></a>   </p>
                                </div>
                                <div className={'step3-button'}>
                                    <ButtonGroup>
                                        <Button onClick={() => { this.props.callbackStepSetupChange(2); this.props.AppCallbackCheckPlanCreatePixelFunction() }}>Create another pixel</Button>
                                        <Button onClick={() => { this.props.callbackStepSetupChange(2); this.props.callbackSelectedTabChange(1) }} primary>Manager Pixel</Button>
                                    </ButtonGroup>
                                </div>

                            </div>

                        </Card>

                    </Layout.Section>
                    <Layout.Section secondary>
                        <MediaCard
                            title="How do I know if Facebook Pixel is working? "
                            primaryAction={{
                                content: 'Learn more',
                                onAction: () => { window.open(moreAppConfig.linkVideo.howPixelWorking, '_blank').focus(); },
                            }}
                            description={`Facebook Pixel Helper is a Google Chrome extension from Facebook that lets you test your pixel implementation. `}
                            popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                        >
                            <VideoThumbnail
                                videoLength={80}
                                onClick={() => { window.open(moreAppConfig.linkVideo.howPixelWorking, '_blank').focus(); }}
                                thumbnailUrl={moreAppConfig.linkImageVideo.howPixelWorking}
                            />
                        </MediaCard>
                    </Layout.Section>

                </Layout>

            </>
        );
    }
}

export default Step3;