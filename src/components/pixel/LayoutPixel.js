import React, { useCallback, Component } from 'react';
import { Tabs, Card } from '@shopify/polaris';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import CreatePixel from './CreatePixel';
import ManagePixel from './ManagePixel';
import Setting from './Setting';
import Plan from '../plan/Plan';
import ChoosePlan from '../plan/ChoosePlan';
import Pricing from '../feed/Pricing';
import Setup from '../feed/Setup';
import Help from '../document/Help';

class LayoutPixel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TabIndex: 0,
            tabs: [
                {
                    id: 'create-pixel',
                    content: 'Create Pixel'
                },
                {
                    id: 'manage-pixel',
                    content: 'Manage Pixel'
                },
                {
                    id: 'setting',
                    content: 'Setting'
                },
                {
                    id: 'plan',
                    content: 'Plan'
                },
                {
                    id: 'feed',
                    content: 'Facebook Product Feed'
                },
                {
                    id: 'help',
                    content: 'Help'
                }
            ]
        }
        this.callbackStepSetupChange = this.callbackStepSetupChange.bind(this);
    }



    callbackPixelStepSetupFunction = (pixel) => {
        this.props.AppCallbackShopFuntion({
            ...this.props.shop,
            StepSetup: 1,
            pixelStepSetup: pixel
        });
    }


    callbackStepSetupChange = (stepSetup) => {
        if (stepSetup == 3) {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: stepSetup,
                pixelStepSetup: null,
                pixelStepSetupName: this.props.shop.pixelStepSetup.Title
            });

        }
        else if (stepSetup == 4) {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: 0,
                pixelStepSetup: null
            });
        }
        else {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: stepSetup
            });
        }

    };

    callbackSelectedTabCreateChange = (selected, pixel) => {
        debugger;
        if (pixel != null) {
            this.setState({
                tabs: [
                    {
                        id: 'create-pixel',
                        content: 'Edit Pixel'
                    },
                    {
                        id: 'manage-pixel',
                        content: 'Manage Pixel'
                    },
                    {
                        id: 'setting',
                        content: 'Setting'
                    },
                    {
                        id: 'plan',
                        content: 'Plan'
                    },
                    {
                        id: 'feed',
                        content: 'Facebook Product Feed'
                    },
                    {
                        id: 'help',
                        content: 'Help'
                    }
                ]
            })
        }
        else {
            this.setState({
                tabs: [
                    {
                        id: 'create-pixel',
                        content: 'Create Pixel'
                    },
                    {
                        id: 'manage-pixel',
                        content: 'Manage Pixel'
                    },
                    {
                        id: 'setting',
                        content: 'Setting'
                    },
                    {
                        id: 'plan',
                        content: 'Plan'
                    },
                    {
                        id: 'feed',
                        content: 'Facebook Product Feed'
                    },
                    {
                        id: 'help',
                        content: 'Help'
                    }
                ]
            })
        }
        this.props.AppCallbackSelectedTabCreateFunction(selected, pixel);


    }

    callbackSelectedTabChange = (selected) => {
        this.setState({
            tabs: [
                {
                    id: 'create-pixel',
                    content: 'Create Pixel'
                },
                {
                    id: 'manage-pixel',
                    content: 'Manage Pixel'
                },
                {
                    id: 'setting',
                    content: 'Setting'
                },
                {
                    id: 'plan',
                    content: 'Plan'
                },
                {
                    id: 'feed',
                    content: 'Facebook Product Feed'
                },
                {
                    id: 'help',
                    content: 'Help'
                }
            ]
        })
        this.props.AppCallbackSelectedTabFunction(selected);

    }

    callbackSavePixelSuccess = () => {
        this.setState({
            tabs: [
                {
                    id: 'create-pixel',
                    content: 'Create Pixel'
                },
                {
                    id: 'manage-pixel',
                    content: 'Manage Pixel'
                },
                {
                    id: 'setting',
                    content: 'Setting'
                },
                {
                    id: 'plan',
                    content: 'Plan'
                },
                {
                    id: 'feed',
                    content: 'Facebook Product Feed'
                },
                {
                    id: 'help',
                    content: 'Help'
                }
            ]
        })
        this.props.AppCallbackAfterSavePixelSuccess();

    }


    callbackIsShowPlanFuntion = (isShowPlan) => {
        this.props.AppCallbackIsShowPlanFuntion(isShowPlan);
    }

    handleTabChange =
        (selected) => {
            this.setState({
                tabs: [
                    {
                        id: 'create-pixel',
                        content: 'Create Pixel'
                    },
                    {
                        id: 'manage-pixel',
                        content: 'Manage Pixel'
                    },
                    {
                        id: 'setting',
                        content: 'Setting'
                    },
                    {
                        id: 'plan',
                        content: 'Plan'
                    },
                    {
                        id: 'feed',
                        content: 'Facebook Product Feed'
                    },
                    {
                        id: 'help',
                        content: 'Help'
                    }
                ]
            })
            if (selected == 0) {
                this.props.AppCallbackCheckPlanCreatePixelFunction();
            }
            else {
                this.props.AppCallbackSelectedTabFunction(selected);
            }
        };
    render() {
        debugger;
        switch (this.props.selectedTab) {
            case 0:
                switch (this.props.shop.StepSetup) {
                    case 0:

                        return (
                            <Tabs
                                tabs={this.state.tabs}
                                selected={this.props.selectedTab}
                                onSelect={this.handleTabChange}
                            >

                                <Card.Section>
                                    <Step1 shop={this.props.shop} setting={this.props.setting} pixelStepSetup={this.props.pixelStepSetup} 
                                    callbackStepSetupChange={this.callbackStepSetupChange} 
                                    callbackSelectedTabChange={this.callbackSelectedTabChange} 
                                    callbackPixelStepSetupFunction={this.callbackPixelStepSetupFunction}></Step1>
                                </Card.Section>
                            </Tabs>
                        );
                    case 1:
                        return (
                            <Tabs
                                tabs={this.state.tabs}
                                selected={this.props.selectedTab}
                                onSelect={this.handleTabChange}
                            >

                                <Card.Section>
                                    <Step2 shop={this.props.shop} setting={this.props.setting} pixelStepSetup={this.props.pixelStepSetup} callbackStepSetupChange={this.callbackStepSetupChange} ></Step2>
                                </Card.Section>
                            </Tabs>
                        );
                    case 3:
                        return (
                            <Tabs
                                tabs={this.state.tabs}
                                selected={this.props.selectedTab}
                                onSelect={this.handleTabChange}
                            >

                                <Card.Section>
                                    <Step3 shop={this.props.shop} setting={this.props.setting} pixelStepSetupName={this.props.shop.pixelStepSetupName}
                                        callbackStepSetupChange={this.callbackStepSetupChange}
                                        callbackSelectedTabChange={this.callbackSelectedTabChange}
                                        callbackSelectedTabCreateChange={this.callbackSelectedTabCreateChange}
                                        AppCallbackCheckPlanCreatePixelFunction={this.props.AppCallbackCheckPlanCreatePixelFunction}></Step3>
                                </Card.Section>
                            </Tabs>
                        );
                    case 2:
                        return (
                            <Tabs
                                tabs={this.state.tabs}
                                selected={this.props.selectedTab}
                                onSelect={this.handleTabChange}
                            >

                                <Card.Section>
                                    <CreatePixel shop={this.props.shop} setting={this.props.setting} pixelEdit={this.props.pixelEdit} 
                                    callbackSelectedTabChange={this.callbackSelectedTabChange} 
                                    callbackIsShowPlanFuntion={this.callbackIsShowPlanFuntion}
                                    callbackSavePixelSuccess={this.callbackSavePixelSuccess}></CreatePixel>
                                </Card.Section>
                            </Tabs>
                        );
                    default:
                        break;
                }

            case 1:
                return (
                    <Tabs
                        tabs={this.state.tabs}
                        selected={this.props.selectedTab}
                        onSelect={this.handleTabChange}
                    >

                        <Card.Section>
                            <ManagePixel shop={this.props.shop} setting={this.props.setting} hasRating={this.props.hasRating} isCompleteSave={this.props.isCompleteSave}
                                AppCallbackWriteQuickReview={this.props.AppCallbackWriteQuickReview}
                                AppCallBackIsCompleteSave={this.props.AppCallBackIsCompleteSave}
                                callbackStepSetupChange={this.callbackStepSetupChange}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackSelectedTabCreateChange={this.callbackSelectedTabCreateChange}
                                AppCallbackCheckPlanCreatePixelFunction={this.props.AppCallbackCheckPlanCreatePixelFunction}
                                AppCallbackPixelCountFunction = {this.props.AppCallbackPixelCountFunction}></ManagePixel>
                        </Card.Section>
                    </Tabs>
                );
            case 2:
                return (
                    <Tabs
                        tabs={this.state.tabs}
                        selected={this.props.selectedTab}
                        onSelect={this.handleTabChange}
                    >

                        <Card.Section>
                            <Setting shop={this.props.shop} setting={this.props.setting} AppCallbackSettingFuntion={this.props.AppCallbackSettingFuntion}></Setting>
                        </Card.Section>
                    </Tabs>
                );
            case 3:
                return (
                    <Tabs
                        tabs={this.state.tabs}
                        selected={this.props.selectedTab}
                        onSelect={this.handleTabChange}
                    >

                        <Card.Section>
                            <div className={'plan'}>
                                <ChoosePlan shop={this.props.shop} setting={this.props.setting}
                                    AppCallbackIsShowPlanFuntion={this.props.AppCallbackIsShowPlanFuntion}
                                    AppCallbackIsLoadingFuntion={this.props.AppCallbackIsLoadingFuntion}
                                    AppCallbackShopFuntion={this.props.AppCallbackShopFuntion}
                                    AppCallbackSettingFuntion={this.props.AppCallbackSettingFuntion} />
                            </div>
                        </Card.Section>
                    </Tabs>
                );
            case 4:
                return (
                    <Tabs
                        tabs={this.state.tabs}
                        selected={this.props.selectedTab}
                        onSelect={this.handleTabChange}
                    >

                        <Card.Section>
                            <Setup shop={this.props.shop} setting={this.props.setting} feed={this.props.feed}
                                AppCallbackShopFuntion={this.props.AppCallbackShopFuntion}
                                AppCallbackFeedFuntion={this.props.AppCallbackFeedFuntion}></Setup>
                        </Card.Section>
                    </Tabs>
                );
            case 5:
                return (
                    <Tabs
                        tabs={this.state.tabs}
                        selected={this.props.selectedTab}
                        onSelect={this.handleTabChange}
                    >

                        <Card.Section>
                            <Help shop={this.props.shop} setting={this.props.setting}></Help>
                        </Card.Section>
                    </Tabs>
                );
            default:
                break;
        }

    }
}

export default LayoutPixel;