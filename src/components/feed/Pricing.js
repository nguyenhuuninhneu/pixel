import React, { Component } from 'react';
import { Card, Link, Heading, Icon, Layout, Button, OptionList, Modal } from '@shopify/polaris'
import feedBannerImg1 from '../../assets/images/feed-pricing-banner-1.png'
import feedBannerImg2 from '../../assets/images/feed-pricing-banner-2.png'
import feedBannerImg3 from '../../assets/images/feed-pricing-banner-3.png'
import feedBannerImgRight from '../../assets/images/feed-pricing-banner-right.png'
import moreAppConfig from '../../config/moreAppConfig';
import Plan from './Plan';

class Pricing extends Component {
    render() {
        return (
            <div className={'feed-pricing'}>
                <div className={'feed-pricing-banner'}>
                    <Layout>
                        <Layout.Section secondary>
                            <Card title="Online store dashboard">
                                <div className={'feed-pricing-banner-item'}>
                                    <div className={'feed-pricing-banner-item-image'}>
                                        <img src={feedBannerImg1} width="100%" style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }} />
                                    </div>
                                    <div className={'feed-pricing-banner-item-content'}>
                                        <p>Create a product feed and upload on Facebook Product Catalog, in order to create Dynamic Product Ads</p>

                                    </div>
                                </div>
                            </Card>
                            <Card title="Online store dashboard">
                                <div className={'feed-pricing-banner-item'}>
                                    <div className={'feed-pricing-banner-item-image'}>
                                        <img src={feedBannerImg2} width="100%" style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }} />
                                    </div>
                                    <div className={'feed-pricing-banner-item-content'}>
                                        <p><b>Once you create the feed, the information of your products, can be automatically uploaded to facebook ads account</b></p>

                                    </div>
                                </div>
                            </Card>
                            <Card title="Online store dashboard">
                                <div className={'feed-pricing-banner-item'}>
                                    <div className={'feed-pricing-banner-item-image'}>
                                        <img src={feedBannerImg3} width="100%" style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }} />
                                    </div>
                                    <div className={'feed-pricing-banner-item-content'}>
                                        <p>Updated every 24 hours Which also can be manually updated any time you want</p>

                                    </div>
                                </div>
                            </Card>

                        </Layout.Section>
                        <Layout.Section secondary>
                            <div className={'feed-pricing-banner-right'}>
                                <img src={feedBannerImgRight} width="100%" style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }} />
                            </div>


                        </Layout.Section>
                    </Layout>
                </div>
                <div className={'feed-pricing-plan'}>
                    <Card title="Pricing" sectioned>
                        <Plan shop={this.props.shop} setting={this.props.setting} feed={this.props.feed}></Plan>

                    </Card>
                </div>
            </div>

        );
    }
}

export default Pricing;