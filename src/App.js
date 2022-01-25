import './App.css';
import './assets/css/App.css';
import './assets/css/responsive.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import { Banner, Button, ButtonGroup, FormLayout, Layout, Modal, Page, TextField, Toast, Heading } from '@shopify/polaris';
import React, { useEffect, useState, useRef } from 'react';
import config from './config/config';
import moreAppConfig from './config/moreAppConfig';
import Plan from './components/plan/Plan';
import ChoosePlan from './components/plan/ChoosePlan';
import Loading from './components/plugins/Loading';
import axios from 'axios';
import LayoutPixel from './components/pixel/LayoutPixel';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useAppBridge, Context } from '@shopify/app-bridge-react'
import { getSessionToken } from '@shopify/app-bridge-utils'
import createApp from "@shopify/app-bridge";
import AdsHeader from './assets/images/Ads-header.png';
import AdsDes from './assets/images/ads-des.png';
import santa from './assets/images/santa.gif';
import background from '../src/assets/images/background.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const App = () => {
    const [Shop, setShop] = useState(0);
    const [Feed, setFeed] = useState(0);
    const [Setting, setSetting] = useState(0);
    const [IsLoading, setIsLoading] = useState(true);
    const [IsShowPlan, setIsShowPlan] = useState(false);
    const [selectedTab, setselectedTab] = useState(0);
    const [pixelEdit, setpixelEdit] = useState(null);
    const [pixelCount, setpixelCount] = useState(0);
    const [hasRating, sethasRating] = useState(true);
    const [isOpenModal, setisOpenModal] = useState(false);
    const [isOpenModalAds, setisOpenModalAds] = useState(false);
    const [rating, setrating] = useState(0);
    const [reviewContent, setreviewContent] = useState('');
    const [errorReviewContent, seterrorReviewContent] = useState('');
    const [toastSent, settoastSent] = useState(null);
    const [isCompleteSave, setisCompleteSave] = useState(false);
    const [Email, setEmail] = useState('');
    const [errorEmail, seterrorEmail] = useState('');
    const [xmasStep, setxmasStep] = useState(0);
    const [reviewXmas, setreviewXmas] = useState('');
    const [errorReviewXmas, seterrorReviewXmas] = useState('');


    const [stepVote, setStepVote] = useState(0);
    const [closeBanner, setCloseBanner] = useState(false);
    const [textImprove, setTextImprove] = useState('');
    const [textImproveValid, setTextImproveValid] = useState('');
    const handleChangeTextImprove = (newValue) => {
        setTextImprove(newValue);
        if (newValue == '') {
            setTextImproveValid(moreAppConfig.ImproveValidationText);
        } else {
            setTextImproveValid('');
        }
    };
    const sendImprovement = () => {
        if (textImprove == '') {
            setTextImproveValid(moreAppConfig.ImproveValidationText);
        } else {
            setTextImproveValid('');
            axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                ShopID: Shop.ID,
                Rating: rating,
                Feedback: textImprove
            })
                .then(function (response) {
                    setStepVote(3);
                    settoastSent(<Toast content="The form information was sent successfully. We will contact you as soon as possible." onDismiss={() => { settoastSent(null) }} duration={4500} />)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }
    const changeCloseBanner = () => {
        setCloseBanner(true);
    }
    const applyNow = () => {
        AppCallbackSelectedTabFunction(5);
        setCloseBanner(true);
    }
    const [clickedOutside, setClickedOutside] = useState(false);
    const myRef = useRef();

    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target)) {
            setClickedOutside(true);
        }
    };

    const handleClickInside = () => setClickedOutside(false);


    const handleCloseAds = () => {
        axios.post(config.rootLink + '/FrontEnd/CloseAdsPopup', {
            ShopID: Shop.ID,
        })
            .then(function (response) {
                setisOpenModalAds(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    const handleSubmitAds = () => {
        if (Email == '') {
            seterrorEmail("Email is required.");
        } else {
            axios.post(config.rootLink + '/FrontEnd/SaveAdsPopup', {
                ShopID: Shop.ID,
                email: Email
            })
                .then(function (response) {
                    setisOpenModalAds(false);
                    settoastSent(<Toast content="The form information was sent successfully. We will contact you as soon as possible." onDismiss={() => { settoastSent(null) }} duration={4500} />)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }

    const handleEmailChange = (e) => {
        if (e == '') {
            setEmail(e);
            seterrorEmail("Email is required.");
        } else {
            setEmail(e);
            seterrorEmail("");
        }

    }

    const AppCallbackCheckPlanCreatePixelFunction = () => {
        debugger;
        let that = this;
        axios.get(config.rootLink + '/Plan/CheckPlan?id=' + Shop.ID)
            .then(function (response) {
                debugger;
                if (response.data.planNumber == 0 && response.data.countPixel > 0) {
                    setselectedTab(3);
                }
                else {
                    setpixelEdit(null);
                    setselectedTab(0);
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    const AppCallbackIsShowPlanFuntion = (isShowPlan) => {
        setIsShowPlan(isShowPlan);
    }

    const AppCallbackShopFuntion = (shop) => {
        setShop(shop);
    }

    const AppCallbackFeedFuntion = (feed) => {
        setFeed(feed);
    }

    const AppCallbackSettingFuntion = (setting) => {
        setSetting(setting);
    }

    const AppCallbackIsLoadingFuntion = (isLoading) => {
        setIsLoading(isLoading);
    }

    const AppCallbackSelectedTabFunction = (selected) => {
        setselectedTab(selected);
        if (selected == 0) {
            setpixelEdit(null);
        }
        if (selected != 0 && Shop.StepSetup == 3) {
            setShop({
                ...Shop,
                StepSetup: 2
            })
        }
    }
    const AppCallbackAfterSavePixelSuccess = () => {
        setisCompleteSave(true);
        setselectedTab(1);
    }
    const AppCallbackSelectedTabCreateFunction = (selected, pixel) => {
        setselectedTab(selected);
        setpixelEdit(pixel);
    }

    const AppCallbackPixelCountFunction = (count) => {
        setpixelCount(count);
    }

    const onDismissReview = () => {
        axios.post(config.rootLink + '/FrontEnd/CreateRating', {
            ShopID: Shop.ID,
            Rating: 0
        })
            .then(function (response) {
                sethasRating(true);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    const onWriteQuickReview = (isRedirect) => {
        axios.post(config.rootLink + '/FrontEnd/UpdateSavePopup', {
            ...Setting,
            ShowColumnTotal: false
        })
            .then(function (response) {
                setSetting({
                    ...Setting,
                    ShowColumnTotal: false
                })
                if (isRedirect) {
                    window.open('https://apps.shopify.com/yuri-facebook-multi-pixels?reveal_new_review=true', '_blank').focus();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    const handleReviewContentChange = (e) => {
        if (e == '') {
            setreviewContent(e);
            seterrorReviewContent("Content is required.");
        } else {
            setreviewContent(e);
        }

    }

    const handleReviewXmasChange = (e) => {
        if (e == '') {
            setreviewXmas(e);
            seterrorReviewXmas("Content is required.");
        } else {
            setreviewXmas(e);
        }

    }

    const loadChatPlugin = () => {
        const script = document.createElement("script");
        script.src = "//code.tidio.co/rvxustxuoq2e0mgcep1x1zrt3ynxmkhi.js";
        script.async = true;
        document.body.appendChild(script);

        const script2 = document.createElement("script");
        script2.innerHTML = ` (function() {
      function onTidioChatApiReady() {
        tidioChatApi.setVisitorData({ 
          name: "${config.shop}",  
          tags: ["FacebookPixel"]
        });
      }
      if (window.tidioChatApi) {
        window.tidioChatApi.on("ready", onTidioChatApiReady);
      } else {
        document.addEventListener("tidioChat-ready", onTidioChatApiReady);
      }
    })();` ;
        document.body.appendChild(script2);

    }

    const loadGoogleScript = () => {
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=UA-146802944-1";
        script.async = true;
        document.body.appendChild(script);

        const script2 = document.createElement("script");
        script2.innerHTML = ` window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-146802944-1');` ;
        document.body.appendChild(script2);
    }

    const handleSubmitReview = () => {
        if (reviewContent == '') {
            seterrorReviewContent("Content is required.");
        } else {
            axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                ShopID: Shop.ID,
                Rating: rating,
                Feedback: reviewContent
            })
                .then(function (response) {
                    sethasRating(true);
                    setisOpenModal(false);
                    settoastSent(<Toast content="The form information was sent successfully. We will contact you as soon as possible." onDismiss={() => { settoastSent(null) }} duration={4500} />)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }

    const handleSubmitXmas = () => {
        if (reviewXmas == '') {
            seterrorReviewXmas("Content is required.");
        } else {
            axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                ShopID: Shop.ID,
                Rating: rating,
                Feedback: reviewXmas
            })
                .then(function (response) {
                    setxmasStep(3);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }
    useEffect(async () => {
        debugger;

        console.log('abc: ' + config.admin);
        if (config.admin == undefined) {
            loadGoogleScript();
            const app = createApp({ apiKey: config.apiKey, shopOrigin: config.shop });
            const sessionToken = await getSessionToken(app);
            loadChatPlugin();
        }
        axios.get(config.rootLink + '/FrontEnd/GetShop?shop=' + config.shop)
            .then(function (response) {
                // handle success
                console.log(response);
                setIsLoading(false, [IsLoading]);
                setShop(response.data.shop, [Shop]);
                setFeed(response.data.feed, [Feed]);
                setSetting(response.data.setting, [Setting]);
                setIsShowPlan(!response.data.shop.Status);
                setpixelCount(response.data.pixelCount);
                sethasRating(response.data.hasRating);
                setselectedTab(response.data.shop.StepSetup < 2 ? 0 : 1);
                setisOpenModalAds(response.data.setting.TextEach != 'true');
                if (response.data.hasPlan) {
                    window.open(response.data.confirmUrl, "_blank");
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    if (IsLoading) {
        return (<Loading />)
    }
    else {
        if (IsShowPlan) {
            return (
                <Page >
                    <div className={'plan'}>
                        <Plan />
                        <ChoosePlan shop={Shop} setting={Setting}
                            AppCallbackIsShowPlanFuntion={AppCallbackIsShowPlanFuntion}
                            AppCallbackIsLoadingFuntion={AppCallbackIsLoadingFuntion}
                            AppCallbackShopFuntion={AppCallbackShopFuntion}
                            AppCallbackSettingFuntion={AppCallbackSettingFuntion} />
                    </div>
                </Page>
            );
        }
        else {
            return (
                <>
                    <LayoutPixel shop={Shop} setting={Setting} selectedTab={selectedTab} pixelEdit={pixelEdit} hasRating={hasRating} isCompleteSave={isCompleteSave} feed={Feed}
                        AppCallBackIsCompleteSave={setisCompleteSave}
                        AppCallbackAfterSavePixelSuccess={AppCallbackAfterSavePixelSuccess}
                        AppCallbackWriteQuickReview={onWriteQuickReview}
                        AppCallbackIsShowPlanFuntion={AppCallbackIsShowPlanFuntion}
                        AppCallbackIsLoadingFuntion={AppCallbackIsLoadingFuntion}
                        AppCallbackShopFuntion={AppCallbackShopFuntion}
                        AppCallbackSelectedTabFunction={AppCallbackSelectedTabFunction}
                        AppCallbackSelectedTabCreateFunction={AppCallbackSelectedTabCreateFunction}
                        AppCallbackSettingFuntion={AppCallbackSettingFuntion}
                        AppCallbackCheckPlanCreatePixelFunction={AppCallbackCheckPlanCreatePixelFunction}
                        AppCallbackPixelCountFunction={AppCallbackPixelCountFunction}
                        AppCallbackFeedFuntion={AppCallbackFeedFuntion} />
                    {toastSent}
                    <div className={'orichi-review'} style={(pixelCount >= 1 && !hasRating) ? {} : { display: 'none' }} >
                        <Banner title="" onDismiss={onDismissReview}>
                            <h1>We will truly appreciate if you could take 10 seconds to give us a review. Your review is our energy to move forward.</h1>
                            <div className={'orichi-review-star'}>
                                <Rating
                                    name="customized-empty"
                                    defaultValue={0}
                                    precision={1}
                                    onChange={(event, newValue) => {
                                        debugger;
                                        if (newValue != null) {
                                            if (newValue == 5) {
                                                axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                    ShopID: Shop.ID,
                                                    Rating: 5
                                                })
                                                    .then(function (response) {
                                                        sethasRating(true);
                                                        window.open('https://apps.shopify.com/yuri-facebook-multi-pixels?reveal_new_review=true', '_blank');
                                                    })
                                                    .catch(function (error) {
                                                        // handle error
                                                        console.log(error);
                                                    })
                                            }
                                            else {
                                                axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                    ShopID: Shop.ID,
                                                    Rating: newValue
                                                })
                                                    .then(function (response) {
                                                        setisOpenModal(true);
                                                        setrating(newValue);
                                                    })
                                                    .catch(function (error) {
                                                        // handle error
                                                        console.log(error);
                                                    })

                                            }

                                        }

                                    }}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                    size="large" />
                            </div>

                        </Banner>
                    </div>
                    <div style={{ height: isOpenModal ? '500px' : '0px' }}>
                        <Modal
                            open={isOpenModal}
                            onClose={() => { setisOpenModal(false); }}
                            title="Sorry to hear that! How could we improve?"
                            primaryAction={{
                                content: 'Submit',
                                onAction: handleSubmitReview,
                            }}
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onAction: () => { setisOpenModal(false); },
                                },
                            ]}
                        >
                            <Modal.Section>
                                <FormLayout>
                                    <TextField
                                        label=""
                                        value={reviewContent}
                                        onChange={handleReviewContentChange}
                                        multiline={4}
                                        error={errorReviewContent}
                                        placeholder="Share your experience with us "
                                    />
                                </FormLayout>
                            </Modal.Section>
                        </Modal>
                    </div>
                    <div style={{ height: isOpenModalAds ? '500px' : '0px' }}>
                        <Modal
                            large
                            open={false}
                            onClose={handleCloseAds}
                            title={<>We've got some <b>BIG news</b> to share  <img className={'modal-ads-img'} src={AdsHeader} ></img></>}

                        >
                            <Modal.Section>
                                <Layout>
                                    <Layout.Section secondary>
                                        <div className={'modal-ads-des'}>
                                            <p>On <b>November 3rd</b>, we will launch a <b>new feature</b>.</p>
                                            <br />
                                            <h2 className={'modal-ads-title'}>Facebook Feed Product</h2>
                                            <br />
                                            <p>Facebook Feed Product helps you <b>sync</b> products <br /> from  Shopify to Facebook <b>automatically</b>.<br /> Everything will be installed easily with just <b>1 click</b>.</p>
                                            <br />
                                            <ButtonGroup>
                                                <TextField
                                                    placeholder={'Your e-mail'}
                                                    autoComplete="off"
                                                    id={'ads-email'}
                                                    value={Email}
                                                    error={errorEmail}
                                                    onChange={handleEmailChange}
                                                />
                                                <Button id={'ads-btn'} onClick={handleSubmitAds}>Submit</Button>
                                            </ButtonGroup>

                                        </div>
                                    </Layout.Section>
                                    <Layout.Section secondary>
                                        <div className={'modal-ads-second'}>
                                            <img src={AdsDes}></img>
                                            <p>Leave your email to receive the latest <br /> information when it is released and have a<br /> chance to get a <b>20% discount</b> </p>
                                        </div>
                                    </Layout.Section>
                                </Layout>
                            </Modal.Section>
                        </Modal>
                    </div>
                    {false ?
                        ((xmasStep == 4) ? <div className='xmas-icon' onClick={
                            () => { setxmasStep(0) }
                        }>
                            <img src={santa}></img>
                        </div> :
                            <div className={"modal-ads-xmas overlay"} onClick={(e) => { if (e.target.className == 'modal-ads-xmas overlay') { setxmasStep(4) } }}>
                                <div className={xmasStep == 0 ? "popup popup-gif" : "popup"}>
                                    <div className="modal-ads-xmas-content">
                                        {
                                            xmasStep == 0 ?
                                                <div className="modal-ads-xmas-step1">
                                                    <Button onClick={() => { setxmasStep(1) }}>Grab Deal</Button>
                                                </div>
                                                : ((xmasStep == 1 || xmasStep == 2) ?
                                                    <div className="modal-ads-xmas-step2">
                                                        <div className='modal-ads-xmas-step2-des'>
                                                            <h2>Enjoying Our Service?</h2>
                                                            <p>Could you take 60 seconds to <br /> share your happy experience</p>
                                                        </div>
                                                        <div className='modal-ads-xmas-step2-star'>
                                                            <Rating
                                                                name="xmas"
                                                                defaultValue={0}
                                                                precision={1}
                                                                onChange={(event, newValue) => {
                                                                    debugger;
                                                                    if (newValue != null) {
                                                                        if (newValue == 5 || newValue == 4) {
                                                                            axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                                                ShopID: Shop.ID,
                                                                                Rating: newValue
                                                                            })
                                                                                .then(function (response) {
                                                                                    setxmasStep(1);
                                                                                    window.open('https://apps.shopify.com/yuri-facebook-multi-pixels?reveal_new_review=true', '_blank');
                                                                                })
                                                                                .catch(function (error) {
                                                                                    // handle error
                                                                                    console.log(error);
                                                                                })
                                                                        }
                                                                        else {
                                                                            axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                                                ShopID: Shop.ID,
                                                                                Rating: newValue
                                                                            })
                                                                                .then(function (response) {
                                                                                    setxmasStep(2);
                                                                                    setrating(newValue);
                                                                                })
                                                                                .catch(function (error) {
                                                                                    // handle error
                                                                                    console.log(error);
                                                                                })

                                                                        }

                                                                    }

                                                                }}
                                                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                                size="large" />
                                                        </div>
                                                        {xmasStep == 1 ? <>
                                                            <div className='modal-ads-xmas-step2-code'>
                                                                <span>CODE: DISCOUNT25OFF</span>
                                                            </div>
                                                            <div className='modal-ads-xmas-step2-apply'>
                                                                <Button onClick={() => { AppCallbackSelectedTabFunction(5); setxmasStep(4); }}>Apply Now</Button>
                                                            </div>
                                                        </> : <>
                                                            <div className='modal-ads-xmas-step2-comment'>
                                                                <TextField
                                                                    label="Sorry to hear that! How could we improve?"
                                                                    value={reviewXmas}
                                                                    onChange={handleReviewXmasChange}
                                                                    placeholder='Share your experience with us'
                                                                    multiline={4}
                                                                    autoComplete="off"
                                                                    error={errorReviewXmas}
                                                                />

                                                                <Button onClick={() => { handleSubmitXmas() }}>Send</Button>

                                                            </div>
                                                        </>}

                                                    </div>
                                                    : <div className="modal-ads-xmas-step2">
                                                        <div className='modal-ads-xmas-step2-thankyou'>
                                                            <p>
                                                                Thank you for your feedback regarding our app. What you shared with me will help me to improve the experience.

                                                            </p>
                                                            <Button onClick={() => { setxmasStep(4) }}>Close</Button>
                                                        </div>
                                                    </div>)
                                        }


                                    </div>
                                </div>
                            </div>
                        )
                        : <></>}


                    {true ?
                        <>
                            <div id='root-banner'>
                                <div className={closeBanner || clickedOutside ? 'hide-banner' : 'banner'}>
                                    <div className='banner-block' ref={myRef} onClick={handleClickInside}
                                    >
                                        {
                                            stepVote === 0 ?
                                                <>
                                                    <div className='intro' style={{ backgroundImage: `url(${background})` }}>
                                                        <div className='info'>
                                                            <Heading>Vietnamese lunar new year</Heading>
                                                            <div className='out-year'>
                                                                <div className='year'>
                                                                    20
                                                                </div>
                                                                <div className='year'>
                                                                    22
                                                                </div>
                                                                <div className='underline'>
                                                                </div>
                                                                <div className='cb'>
                                                                </div>
                                                            </div>

                                                            <p className='mt-10'>Orichi would like to inform you about the schedule of New Year Holiday 2022 as following:</p>
                                                            <p className='paragraph'><span className='c_DB4F6D'>27/01/2022</span> will be closed to
                                                                observe Tet Holidays 2022 from
                                                                <span className='c_DB4F6D'> Thursday, January 27th, 2022 </span>
                                                                to <span className='c_DB4F6D'>Friday, February 06th, 2022</span></p>
                                                            <p className='mb-10'>On this occasion, we would like
                                                                to thank you for your support
                                                                and cooperation in the year 2021
                                                                and look forward to receiving
                                                                your continuing assistance in
                                                                2022. We would like to extend
                                                                the trial day up to <span className='c_DB4F6D'>30 days</span> and
                                                                provide a  <span> </span>
                                                                <CopyToClipboard text={'HOLIDAY_CODE'}>
                                                                    <a href="#" title='discount code' className='pointer' onClick={() => { setStepVote(1) }}><span className='c_DB4F6D'>discount code</span></a>
                                                                </CopyToClipboard>  of <span className='DB4F6D'>20%</span></p>
                                                            <div className='holiday_code'>
                                                                HOLIDAY_CODE
                                                            </div>
                                                            <div className='message'>
                                                                Wish you and your family a healthy, happy,
                                                                and successful new year.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : ''
                                        }
                                        {
                                            stepVote > 0 ?
                                                <>
                                                    <div className='main'>
                                                        <div className='frame'>
                                                            <div className='content'>
                                                                <div className='title'>
                                                                    Holiday_code
                                                                </div>
                                                                <CopyToClipboard text={'HOLIDAY_CODE'}>
                                                                    <Button onClick={() => { applyNow() }}>Apply Now</Button>
                                                                </CopyToClipboard>
                                                                <div className='common'>
                                                                    {
                                                                        stepVote === 1 ?
                                                                            <>
                                                                                <div className='vote-star'>
                                                                                    <div className='enjoy'>
                                                                                        Enjoying Our Service?
                                                                                    </div>
                                                                                    <div className='message'>
                                                                                        Could you take 60 seconds to
                                                                                        share your happy experience
                                                                                    </div>
                                                                                    <div className='star'>
                                                                                        <Rating
                                                                                            name="xmas"
                                                                                            defaultValue={0}
                                                                                            precision={1}
                                                                                            onChange={(event, newValue) => {
                                                                                                debugger;
                                                                                                if (newValue != null) {
                                                                                                    if (newValue == 5 || newValue == 4) {
                                                                                                        axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                                                                            ShopID: Shop.ID,
                                                                                                            Rating: newValue
                                                                                                        })
                                                                                                            .then(function (response) {

                                                                                                                window.open('https://apps.shopify.com/yuri-facebook-multi-pixels?reveal_new_review=true', '_blank');
                                                                                                            })
                                                                                                            .catch(function (error) {
                                                                                                                // handle error
                                                                                                                console.log(error);
                                                                                                            })
                                                                                                    }
                                                                                                    else {
                                                                                                        axios.post(config.rootLink + '/FrontEnd/CreateRating', {
                                                                                                            ShopID: Shop.ID,
                                                                                                            Rating: newValue
                                                                                                        })
                                                                                                            .then(function (response) {
                                                                                                                setStepVote(2);
                                                                                                                setrating(newValue);
                                                                                                            })
                                                                                                            .catch(function (error) {
                                                                                                                // handle error
                                                                                                                console.log(error);
                                                                                                            })

                                                                                                    }

                                                                                                }

                                                                                            }}
                                                                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                                                                            size="large" />
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                            : stepVote === 2 ?
                                                                                //Ideals
                                                                                <>
                                                                                    <div className='send-improvement'>
                                                                                        <p>Sorry to hear that! How could we improve?</p>
                                                                                        <TextField
                                                                                            placeholder="..."
                                                                                            value={textImprove}
                                                                                            error={textImproveValid}
                                                                                            onChange={(e) => { handleChangeTextImprove(e) }}
                                                                                            autoComplete="off"
                                                                                            multiline={4}
                                                                                        />
                                                                                        <Button onClick={() => { sendImprovement() }}>Send</Button>
                                                                                    </div>
                                                                                </>
                                                                                : stepVote === 3 ?
                                                                                    <>
                                                                                        <div className='thank-you'>
                                                                                            <p>Thank you for your feedback regarding our app.
                                                                                                What you shared with me will help me to improve the experience.</p>
                                                                                            <Button onClick={() => { changeCloseBanner() }}>Close</Button>
                                                                                        </div>
                                                                                    </>
                                                                                    : ''
                                                                    }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : ''
                                        }

                                    </div>
                                </div>
                            </div>
                        </>
                        : ''}

                </>
            );
        }

    }

}
export default App;