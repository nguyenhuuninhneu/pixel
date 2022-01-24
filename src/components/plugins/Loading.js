import React from 'react';
import { Card, TextContainer, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage } from '@shopify/polaris';

export default class Loading extends React.Component {
    render() {
        return (
            <SkeletonPage primaryAction secondaryActions={2}>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <SkeletonBodyText />
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                        <Card sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                            </TextContainer>
                        </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                        <Card>
                            <Card.Section>
                                <TextContainer>
                                    <SkeletonDisplayText size="small" />
                                    <SkeletonBodyText lines={2} />
                                </TextContainer>
                            </Card.Section>
                            <Card.Section>
                                <SkeletonBodyText lines={1} />
                            </Card.Section>
                        </Card>
                        <Card subdued>
                            <Card.Section>
                                <TextContainer>
                                    <SkeletonDisplayText size="small" />
                                    <SkeletonBodyText lines={2} />
                                </TextContainer>
                            </Card.Section>
                            <Card.Section>
                                <SkeletonBodyText lines={2} />
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                </Layout>
            </SkeletonPage>
        );
    }
}
