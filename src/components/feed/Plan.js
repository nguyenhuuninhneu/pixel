import React, { Component } from 'react';
import { Card, Link, Heading, Icon, Layout, Button, OptionList, Modal, TextContainer } from '@shopify/polaris'
import moreAppConfig from '../../config/moreAppConfig';
import axios from 'axios';
import config from '../../config/config';

class Plan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PlanNumber: 0,
            IsOpen: false,
            LoadingChoosePlan: false,
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
        axios.get(config.rootLink + '/FrontEnd/Upgrade?id=' + this.props.shop.ID + '&plan=' + this.state.PlanNumber)
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
    render() {
        return (
            <>
                <p>Choose the plan that meets your needs.</p>
                <div className={'choose-plan'}>
                    <Layout>
                        <Layout.Section secondary>
                            <div className={"pricing-plan pricing-plan-starter"}>
                                <h1 className={"pricing-price-header"}><b>Starter</b></h1>
                                <span className={"pricing-price"}>{moreAppConfig.plansFeed[0] == 0 ? 'FREE' : ('$' + moreAppConfig.plansFeed[0])}</span>{moreAppConfig.plansFeed[0] == 0 ? '' : '/Month'}
                                <div className={"pricing-price-list"} >
                                    <OptionList
                                        options={[
                                            { value: '1', label: "Up to 50 Variants / Sku's" },
                                            { value: '2', label: 'Manual Feed Update' },
                                            { value: '3', label: 'Manual Product Update' },
                                        ]}
                                        selected={['1']}
                                        allowMultiple
                                    />
                                </div>

                                <Button onClick={() => this.upgradePlan(0)}>{(this.props.feed != null && this.props.feed.PlanNumber == 0 && this.props.shop.Status) ? 'Your plan' : 'Choose plan'}</Button>
                            </div>
                        </Layout.Section>
                        <Layout.Section secondary>
                            <div className={"pricing-plan pricing-plan-maximum"}>
                                <h1 className={"pricing-price-header"}><b>Professional</b></h1>
                                <span className={"pricing-price"}>{moreAppConfig.plansFeed[2] == 0 ? 'FREE' : ('$' + moreAppConfig.plansFeed[2])}</span>{moreAppConfig.plansFeed[2] == 0 ? '' : '/Month'}
                                <div className={"pricing-price-list"} >
                                    <OptionList
                                        options={[
                                            { value: '1', label: "Unlimited Variants / Sku's " },
                                            { value: '2', label: 'Automatic Feed Update' },
                                            { value: '3', label: 'Automatic Product Update' },
                                            { value: '4', label: 'Priority Customer Service' },
                                        ]}
                                        selected={['1', '2', '3', '4']}
                                        allowMultiple
                                    />
                                </div>

                                <Button onClick={() => this.upgradePlan(2)}>{(this.props.feed != null && this.props.feed.PlanNumber == 2 && this.props.shop.Status) ? 'Your plan' : 'Choose plan'}</Button>
                            </div>
                        </Layout.Section>
                        <Layout.Section secondary>
                            <div className={"pricing-plan pricing-plan-standard"}>
                                <h1 className={"pricing-price-header"}><b>STANDARD</b></h1>
                                <span className={"pricing-price"}>{moreAppConfig.plansFeed[1] == 0 ? 'FREE' : ('$' + moreAppConfig.plansFeed[1])}</span>{moreAppConfig.plansFeed[1] == 0 ? '' : '/Month'}
                                <div className={"pricing-price-list"} >
                                    <OptionList
                                        options={[
                                            { value: '1', label: "Up to 1000 Variants / Sku's" },
                                            { value: '2', label: 'Automatic Feed Update' },
                                            { value: '3', label: 'Automatic Product Update' },
                                        ]}
                                        selected={['1']}
                                        allowMultiple
                                    />
                                </div>

                                <Button onClick={() => this.upgradePlan(1)}>{(this.props.feed != null && this.props.feed.PlanNumber == 1 && this.props.shop.Status) ? 'Your plan' : 'Choose plan'}</Button>
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
                                            Do you want to choose {this.state.PlanNumber == 0 ? 'Starter' : ((this.state.PlanNumber == 1 || this.state.PlanNumber == 3) ? 'Standard' : 'Professional')} plan?
                                        </p>
                                    </TextContainer>
                                </Modal.Section>
                            </Modal>
                        </Layout.Section>


                    </Layout>
                </div>

            </>


        );
    }
}

export default Plan;