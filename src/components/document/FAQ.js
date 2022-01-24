import { Card } from '@shopify/polaris';
import React, { Component } from 'react';

class FAQ extends Component {
    render() {
        return (
            <Card>
                <Card.Section>
                    <p><strong>1: </strong><strong>FACEBOOK PIXEL: Do I need to copy/paste the full Facebook Pixel code somewhere?&nbsp;</strong></p>

                    <p>No, you just have to enter your pixel ID in the dedicated field. The plugin will do the rest for you.</p>

                    <p><strong>2: FACEBOOK PIXEL: Where can I find the Facebook Pixel ID?</strong></p>

                    <p>
                        You can find it here:
                        <a href="https://www.facebook.com/ads/manager/pixel/facebook_pixel" target="_blank">https://www.facebook.com/ads/manager/pixel/facebook_pixel</a>
                    </p>

                    <p><strong>3:</strong><strong>FACEBOOK PIXEL: I used the old Facebook Pixel, will my audiences still work?</strong></p>

                    <p>Yes, they will, you won’t lose anything.</p>

                    <p><strong>4:</strong><strong>Where can I find more information on Facebook Pixel?</strong></p>

                    <p>
                        You can find more information on the Facebook Pixel.
                        <a href="https://www.facebook.com/business/learn/facebook-ads-pixel" target="_blank">https://www.facebook.com/business/learn/facebook-ads-pixel</a>
                    </p>

                    <p>&nbsp;</p>
                </Card.Section>
            </Card>
        );
    }
}

export default FAQ;