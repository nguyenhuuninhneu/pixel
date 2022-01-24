import React, { Component } from 'react';
import { Card, Link, Heading, Icon, Layout } from '@shopify/polaris'
import { ChevronDownMinor } from '@shopify/polaris-icons';
import planimage from '../../assets/images/plan.png'
import moreAppConfig from '../../config/moreAppConfig';

class Plan extends Component {
    render() {
        return (
            <Card title="Welcome to Facebook Multi Pixels by Orichi!" sectioned>
                <Layout>
                    <Layout.Section secondary>
                        <p>If you own a Shopify Store, then your profit depends on your ad campaigns.
                            Our app is a Facebook Pixel app for Shopify, designed to help you easily install your
                            Facebook Pixel in your store and use amazing pixel features to run highly targeted, optimized ad campaigns.
                        </p>
                        <Link url={moreAppConfig.linkDoc} external={true} removeUnderline={true}>Learn more about app</Link>

                    </Layout.Section>
                    <Layout.Section secondary>
                        <img src={planimage} width="100%" style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }} />

                    </Layout.Section>
                </Layout>
                
                <div className={'select-plan'}><Heading>Let's select your plan</Heading><Icon source={ChevronDownMinor} /></div>


            </Card>
        );
    }
}

export default Plan;