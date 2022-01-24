import React, { Component } from 'react';
import { Card, Layout, OptionList, Button, Modal, TextContainer, ButtonGroup } from '@shopify/polaris';
import axios from 'axios';
import config from '../../config/config';
import moreAppConfig from '../../config/moreAppConfig';

class ChoosePlan extends Component {
    constructor(props) {
        debugger;
        super(props);
        this.state = {
            PlanNumber: 0,
            IsOpen: false,
            LoadingChoosePlan: false,
            IsMonthly: (this.props.setting.IsMonthly == null || this.props.setting.IsMonthly == undefined) ? true : this.props.setting.IsMonthly
        };
        this.upgradePlan = this.upgradePlan.bind(this);
        this.handleChangeModal = this.handleChangeModal.bind(this);
    }
    upgradePlan(plan) {
        this.setState({ PlanNumber: plan, IsOpen: true });

    }
    handleChangeModal = () => {
        this.setState({ LoadingChoosePlan: true });
        var that = this;
        axios.get(config.rootLink + '/Plan/Upgrade?id=' + this.props.shop.ID + '&plan=' + this.state.PlanNumber)
            .then(function (response) {
                // handle success
                if (response.data == '') {
                    that.setState({ IsOpen: false });
                }
                else if (response.data == '1') {
                    window.location.reload();
                }
                else {
                    that.setState({ IsOpen: false });
                    window.open(response.data, "_blank");
                }
                that.setState({ LoadingChoosePlan: false });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    chooseMonthlyCharge = (isMonthly) => {
        this.setState({
            IsMonthly: isMonthly
        })
    }
    render() {
        return (
            <Card title="Choose the best plan for your business">
                <div className={'btn-select-plan'}>
                    <ButtonGroup segmented>
                        <Button id={this.state.IsMonthly ? 'btn-select-plan-active' : 'btn-select-plan-monthly'} onClick={() => this.chooseMonthlyCharge(true)}><b>Monthly</b></Button>
                        <Button id={!this.state.IsMonthly ? 'btn-select-plan-active' : 'btn-select-plan-yearly'} onClick={() => this.chooseMonthlyCharge(false)}><b>Yearly(- 10%)</b></Button>
                    </ButtonGroup>
                </div>
                <div className={'choose-plan'}>
                    <Layout>
                        <Layout.Section secondary>
                            <div className={"pricing-plan pricing-plan-standard"}>
                                <h1 className={"pricing-price-header"}><b>STANDARD</b></h1>
                                <span className={"pricing-price"}>{moreAppConfig.plans[0] == 0 ? 'FREE' : ('$' + moreAppConfig.plans[0])}</span>{moreAppConfig.plans[0] == 0 ? '' : '/Month'}
                                <p className={"pricing-price-description"}>This plan is suitable for customers with a Facebook Pixel</p>
                                <div className={"pricing-price-list"} >
                                    <OptionList
                                        options={[
                                            { value: '1', label: '1 pixel track by the browser event' },
                                            { value: '2', label: '> 2 pixels' },
                                            { value: '3', label: 'Facebook Conversion API' },
                                        ]}
                                        selected={['1']}
                                        allowMultiple
                                    />
                                </div>

                                <Button onClick={() => this.upgradePlan(0)}>{(this.props.setting.PlanNumber == 0 && this.props.shop.Status) ? 'Your plan' : 'Choose plan'}</Button>
                            </div>
                        </Layout.Section>
                        {this.state.IsMonthly ? (
                            <>
                                <Layout.Section secondary>
                                    <div className={"pricing-plan pricing-plan-maximum"}>
                                        <div className={"pricing-price-tooltip"}>
                                            <b>IOS 14 Update</b>
                                        </div>
                                        <h1 className={"pricing-price-header"}><b>MAXIMUM</b></h1>
                                        <span className={"pricing-price"}>${moreAppConfig.plans[2]}</span>/Month
                                        <p className={"pricing-price-description"}>It uses Conversions API, which shares data directly from Servers to Facebook. This means the data can’t be blocked by anythings</p>
                                        <div className={"pricing-price-list"} >
                                            <OptionList
                                                options={[
                                                    { value: '2', label: 'Unlimited browser Facebook Pixels' },
                                                    { value: '3', label: 'Facebook Conversion API' },
                                                ]}
                                                selected={['2', '3', '4']}
                                                allowMultiple
                                            />

                                        </div>

                                        <Button onClick={() => this.upgradePlan(2)}><b>{(this.props.setting.PlanNumber == 2 && this.props.shop.Status && this.state.IsMonthly) ? 'Your plan' : 'Trial 7-day FREE'}</b></Button>
                                    </div>
                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={"pricing-plan pricing-plan-enhanced"}>
                                        <h1 className={"pricing-price-header"}><b>ENHANCED</b></h1>
                                        <span className={"pricing-price"}>${moreAppConfig.plans[1]}</span>/Month
                                        <p className={"pricing-price-description"}>If you are using {'>'} 2 pixels, this plan suitable for your business</p>
                                        <div className={"pricing-price-list"} >
                                            <OptionList
                                                options={[
                                                    { value: '2', label: 'Unlimited browser Facebook Pixels' },
                                                    { value: '3', label: 'Facebook Conversion API' },
                                                ]}
                                                selected={['2']}
                                                allowMultiple
                                            />
                                        </div>


                                        <Button onClick={() => this.upgradePlan(1)}>{(this.props.setting.PlanNumber == 1 && this.props.shop.Status && this.state.IsMonthly) ? 'Your plan' : 'Choose plan'}</Button>
                                    </div>
                                </Layout.Section>

                            </>
                        ) : (
                            <>
                                <Layout.Section secondary>
                                    <div className={"pricing-plan pricing-plan-maximum"}>
                                        <div className={"pricing-price-tooltip"}>
                                            <b>IOS 14 Update</b>
                                        </div>
                                        <h1 className={"pricing-price-header"}><b>MAXIMUM</b></h1>
                                        <span className={"pricing-price"}>${moreAppConfig.plans[4]}</span>/Year
                                        <p className={"pricing-price-description"}>It uses Conversions API, which shares data directly from Servers to Facebook. This means the data can’t be blocked by anythings</p>
                                        <div className={"pricing-price-list"} >
                                            <OptionList
                                                options={[
                                                    { value: '2', label: 'Unlimited browser Facebook Pixels' },
                                                    { value: '3', label: 'Facebook Conversion API' },
                                                ]}
                                                selected={['2', '3', '4']}
                                                allowMultiple
                                            />

                                        </div>

                                        <Button onClick={() => this.upgradePlan(4)}><b>{(this.props.setting.PlanNumber == 2 && this.props.shop.Status && !this.state.IsMonthly) ? 'Your plan' : 'Trial 7-day FREE'}</b></Button>
                                    </div>
                                </Layout.Section>
                                <Layout.Section secondary>
                                    <div className={"pricing-plan pricing-plan-enhanced"}>
                                        <h1 className={"pricing-price-header"}><b>ENHANCED</b></h1>
                                        <span className={"pricing-price"}>${moreAppConfig.plans[3]}</span>/Year
                                        <p className={"pricing-price-description"}>If you are using {'>'} 2 pixels, this plan suitable for your business</p>
                                        <div className={"pricing-price-list"} >
                                            <OptionList
                                                options={[
                                                    { value: '2', label: 'Unlimited browser Facebook Pixels' },
                                                    { value: '3', label: 'Facebook Conversion API' },
                                                ]}
                                                selected={['2']}
                                                allowMultiple
                                            />
                                        </div>


                                        <Button onClick={() => this.upgradePlan(3)}>{(this.props.setting.PlanNumber == 1 && this.props.shop.Status && !this.state.IsMonthly) ? 'Your plan' : 'Choose plan'}</Button>
                                    </div>
                                </Layout.Section>


                            </>
                        )}

                    </Layout>
                </div>

                <Modal
                    open={this.state.IsOpen}
                    onClose={() => { this.setState({ IsOpen: false }) }}
                    title="Choose Plan"
                    primaryAction={{
                        content: 'Ok',
                        onAction: this.handleChangeModal,
                        loading: this.state.LoadingChoosePlan
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
                                Do you want to choose {this.state.PlanNumber == 0 ? 'STANDARD' : ((this.state.PlanNumber == 1 || this.state.PlanNumber == 3) ? 'ENHANCED' : 'MAXIMUM')} plan?
                            </p>
                        </TextContainer>
                    </Modal.Section>
                </Modal>

            </Card>
        );
    }

}

export default ChoosePlan;