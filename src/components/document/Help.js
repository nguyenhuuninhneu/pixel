import { Button, Card, DescriptionList, Icon, Layout, Link, MediaCard, Pagination, VideoThumbnail, TextField, TextStyle } from '@shopify/polaris';
import { ChatMajor, CirclePlusMinor, EmailMajor, PhoneMajor } from '@shopify/polaris-icons';
import axios from 'axios';
import React, { Component } from 'react';
import moreAppConfig from '../../config/moreAppConfig';
import config from '../../config/config';
import avatar from '../../assets/images/avatar.jpg';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMedia: 0,
            listMedia: [
                {
                    title: 'How to get the Facebook Pixel ID?',
                    description: `Your Facebook pixel ID is in the Ads Manager. Make your way to the navigation menu, and click on “Pixels”...`,
                    link: moreAppConfig.linkVideo.howToGetFBPixel,
                    image: moreAppConfig.linkImageVideo.howToGetFBPixel
                },
                {
                    title: 'How to remove your pixel from Shopify?',
                    description: `In your Shopify admin, click Online Store > Preferences.......`,
                    link: moreAppConfig.linkVideo.howToRemovePixel,
                    image: moreAppConfig.linkImageVideo.howToRemovePixel
                },
                {
                    title: 'How do I know if Facebook Pixel is working?',
                    description: `Facebook Pixel Helper is a Google Chrome extension from Facebook that lets you test your pixel implementation.`,
                    link: moreAppConfig.linkVideo.howPixelWorking,
                    image: moreAppConfig.linkImageVideo.howPixelWorking
                },
                {
                    title: 'How to get the FB Access Token?',
                    description: `To create a Facebook Pixel, you need access to Facebook Business Manager for your online store...`,
                    link: moreAppConfig.linkVideo.howGetTokenAccess,
                    image: moreAppConfig.linkImageVideo.howGetTokenAccess
                },
                {
                    title: 'How to TEST Facebook Conversion API (CAPI) Events?',
                    description: `Test CAPI Events inside your Events Manager, learn about deduplication and how to check if the Event ID is unique...`,
                    link: moreAppConfig.linkVideo.howTestCAPI,
                    image: moreAppConfig.linkImageVideo.howTestCAPI
                }
            ],
            Posts: [],
            DiscountCode: '',
            DiscountCodeError: null
        }
        this.getPosts();
    }
    getPosts = () => {
        let that = this;
        axios.get(config.rootLink + '/FrontEnd/GetPosts')
            .then(function (response) {
                that.setState({
                    Posts: response.data
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    loadChatPlugin = () => {
        // const script = document.createElement("script");
        // script.src = "//code.tidio.co/rvxustxuoq2e0mgcep1x1zrt3ynxmkhi.js";
        // script.async = true;
        // document.body.appendChild(script);

        // const script2 = document.createElement("script");
        // script2.innerHTML = ` (function() {
        //   function onTidioChatApiReady() {
        //     tidioChatApi.setVisitorData({ 
        //       name: "${config.shop}",  
        //       tags: ["FacebookPixel"]
        //     });
        //   }
        //   if (window.tidioChatApi) {
        //     window.tidioChatApi.on("ready", onTidioChatApiReady);
        //   } else {
        //     document.addEventListener("tidioChat-ready", onTidioChatApiReady);
        //   }
        // })();` ;
        // document.body.appendChild(script2);

    }

    handleApplyDiscountCode = () =>{
        let that = this;
        axios.post(config.rootLink + '/FrontEnd/ApplyDiscountCode', { ShopID: this.props.shop.ID, code: this.state.DiscountCode })
        .then(function (response) {
            that.setState({
                DiscountCodeError: response.data.isSuccess ? <Link url={response.data.message} external>Please click here to confirm the new charge</Link>:
                <TextStyle variation="negative">{response.data.message}</TextStyle>
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    }

    render() {
        return (
            <Layout>
                <Layout.Section>
                    <Card title="Watch video tutorials" sectioned>
                        <p>Did you know we have a super comprehensive help center and video tutorial series which answers most common questions?</p>
                        <div style={{ marginTop: '20px' }}>
                            <MediaCard
                                title={this.state.listMedia[this.state.selectedMedia].title}
                                primaryAction={{
                                    content: 'Learn more',
                                    onAction: () => { window.open(this.state.listMedia[this.state.selectedMedia].link, '_blank').focus(); },
                                }}
                                description={this.state.listMedia[this.state.selectedMedia].description}
                                popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                            >
                                <VideoThumbnail
                                    videoLength={80}
                                    onClick={() => { window.open(this.state.listMedia[this.state.selectedMedia].link, '_blank').focus(); }}
                                    thumbnailUrl={this.state.listMedia[this.state.selectedMedia].image}
                                />
                            </MediaCard>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <Pagination
                                label={`${this.state.selectedMedia + 1}/${this.state.listMedia.length}`}
                                hasPrevious
                                onPrevious={() => {
                                    if (this.state.selectedMedia > 0) {
                                        this.setState({ selectedMedia: this.state.selectedMedia - 1 });
                                    }
                                }}
                                hasNext
                                onNext={() => {
                                    if (this.state.selectedMedia < this.state.listMedia.length - 1) {
                                        this.setState({ selectedMedia: this.state.selectedMedia + 1 });
                                    }
                                }}
                            />
                            <span></span>
                        </div>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="Getting in touch" sectioned>
                        <div className="help-getting-in-touch">
                            <DescriptionList items={[{
                                term: <Icon
                                    source={ChatMajor}
                                    color="base" />,
                                description: <Button primary onClick={() => { debugger; this.loadChatPlugin() }}>Chat with us</Button>
                            }, {
                                term: <Icon
                                    source={EmailMajor}
                                    color="base" />,
                                description: <a className="Polaris-Link" href="mailTo:orichi247@gmail.com" target='_blank' data-polaris-unstyled="true">orichi247@gmail.com</a>
                            }, {
                                term: <Icon
                                    source={PhoneMajor}
                                    color="base" />,
                                description: <a className="Polaris-Link" href="https://api.whatsapp.com/send?phone=+84877566048" target='_blank' data-polaris-unstyled="true">+84877566048</a>
                            }]} />
                        </div>

                    </Card>
                    <Card title="Discount code" sectioned>
                        <div className="help-discount-code">
                            <TextField
                                type="text"
                                value={this.state.DiscountCode}
                                onChange={(e)=> {this.setState({DiscountCode : e})}}
                                autoComplete="off"
                                connectedRight={<Button onClick={() =>{this.handleApplyDiscountCode()}}>Apply</Button>}
                            />
                           {this.state.DiscountCodeError}
                        </div>

                    </Card>
                    <Card title="Resources" sectioned>
                        <ul className="help-resources">
                            {
                                this.state.Posts.map(p =>
                                    <li key={p.ID}>
                                        <div className="help-resources-item">
                                            <div className='help-resources-item-title'>
                                                <h2><a href={p.Link} target={'_blank'}>{p.Title}</a></h2>
                                            </div>
                                            <div className='help-resources-item-des'>
                                                <p>{p.Description}</p>
                                            </div>
                                            <div className='help-resources-item-author'>
                                                <div className='help-resources-item-author-avatar'>
                                                    <img src={avatar}></img>
                                                </div>
                                                <div className='help-resources-item-author-date'>
                                                    <p>Posted by {p.PostedBy} on {p.PostedDateStr} </p>
                                                </div>
                                            </div>
                                        </div>
                                        <hr></hr>
                                    </li>)
                            }

                        </ul>
                        <div className='help-resources-footer'>
                            <Link url={moreAppConfig.linkWebsite} external>
                                View our site
                            </Link>
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        );
    }
}

export default Help;