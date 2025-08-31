$(async function () {

    // Initialize Recharge sdk
    await initializeRechargeSDKOnShopify();

    //Create Dashboard Link
    await createDashboardLinks();

    //render subscriptino html 
    await renderSubscriptionHtml();

});

/**
 * Function for dashboard links
 */
const createDashboardLinks = async () => {
    // get customer portal links 
    const customerLinkObjects = await recharge.customer.getCustomerPortalAccess(sessionRecharge);

    // Set account links
    $('#myAccountManageSubscriptionLink').attr('href', customerLinkObjects.portal_url)
}

/**
 * Function for get current customer details 
 */
const getCurrentCustomDetails = async () => {
    return await recharge.customer.getCustomer(sessionRecharge, { include: ['addresses'] });
}

/**
 * Initialize Recharge SDK
 */
const initializeRechargeSDKOnShopify = async () => {
    recharge.init({
        storeIdentifier: 'talithacoffee.myshopify.com',
        storefrontAccessToken: "strfnt_70034687610123dd3f5b0f03872a5f628ccdb851f4e6275475f8d7e20a581817"
    });

    try {
        const sessionRecharge = await recharge.auth.loginShopifyAppProxy()
        window.sessionRecharge = sessionRecharge;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

/**
 * Function for get Subscription 
 */
const getSubscriptionsByCustomer = async (sessionRecharge) => {
    try {
        return await recharge.subscription.listSubscriptions(sessionRecharge, {
            limit: 25,
            sort_by: 'id-asc'
        });

    } catch (error) {
        console.log(error)
    }
}

/**
 * Get Active Subscription List by customer
 */
const getActiveSubscriptionList = async (sessionRecharge) => {
    try {
        return await recharge.subscription.listSubscriptions(sessionRecharge, {
            limit: 25,
            sort_by: 'id-asc',
            status: 'active'
        });

    } catch (error) {
        console.log(error)
    }
}


/**
 * Get Subscription Html
 */
const renderSubscriptionHtml = async () => {
    // get subscription lists
    const subscriptionLists = await getActiveSubscriptionList(sessionRecharge)

    // run the loop on subscription and prepare html 
    const promises = subscriptionLists.subscriptions.map(async (item, key) => {
        // get product details by id
        const productDetails = await getProductDetailsById([item.external_product_id.ecommerce])

        // get variation details from all variation object
        const variationDetails = await getVariationDetailsFromAllVariationObject(productDetails.products[0], item.external_variant_id.ecommerce)

        // prepare data
        const data = {
            subscriptionId: item.id,
            itemNextSheduleDate: await formatDate(item.next_charge_scheduled_at),
            productTitle: item.product_title,
            itemQty: item.quantity,
            productImage: productDetails.products[0].images[1].large,
            itemVariation: variationDetails.title,
            editSubscriptionLink: await prepareSubscriptionEditLink(item.id)
        };
        return getSingleSubscritpionRowHtml(data);
    });

    // Wait for all promises to resolve
    const columnsHtml = await Promise.all(promises);
    const html = columnsHtml.join('');
    $('#subscriptionListWrapper').html(html);
    $('.activeSubscriptionContainer').show();
}

/**
 * Function for prepare Subscription edit link
 */
const prepareSubscriptionEditLink = async (subscriptionId) => {
    // get customer portal links 
    const customerLinkObjects = await recharge.customer.getCustomerPortalAccess(sessionRecharge);
    return `${customerLinkObjects.base_url}${customerLinkObjects.customer_hash}/subscriptions/${subscriptionId}?token=${customerLinkObjects.temp_token}`;
}

/**
 * Function for variations object from varible
 */
const getVariationDetailsFromAllVariationObject = async (products, varaitionId) => {
    return products.variants.find(item => item.external_variant_id === varaitionId);
}

/**
 * Function for get product details by varaition id
 */
const getProductDetailsById = async (external_product_ids, sessionRecharge = window.sessionRecharge,) => {
    try {
        const productsJson = await recharge.product.productSearch(sessionRecharge, {
            limit: 25,
            format_version: '2022-06',
            external_product_ids: external_product_ids
        });
        return productsJson

    } catch (error) {
        console.log(error)
    }
}

/**
 * Function for formate data
 * 
 */
const formatDate = async (inputDate) => {
    // Parse the input date string
    const date = new Date(inputDate);

    // Get the month and day
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = date.getDate();

    // Return the formatted date
    return `${month} ${day}`;
}

/**
 * Function for get Single Subscription html
 */
const getSingleSubscritpionRowHtml = ({ subscriptionId, itemNextSheduleDate, productTitle, itemQty, productImage, itemVariation,editSubscriptionLink }) => {
    return `
    <div class="subsctiptionListBox">
        <div class="subscriptionListRow">
            <div class="subsctiptionListCol subscriptionDescription">
                <div class="subsctiptionListCol subsctiptionImage">
                    <img src="${productImage}" alt="${productTitle}">
                </div>
                <div class="subsctiptionListCol subsctiptionName">
                    <h3>${productTitle}</h3>
                </div>
            </div>
            <div class="subsctiptionListCol subsctiptionWeight">
                <p>${itemVariation.replace(/\//g, "-")}</p>
            </div>
            <div class="subsctiptionListCol subsctiptionQuantity">
                <p>Qty - ${itemQty}</p>
            </div>
            <div class="subsctiptionListCol subsctiptionShipment">
                <h6>Next Shipment <span>${itemNextSheduleDate}</span></h6>
            </div>
            <div class="subsctiptionListCol subsctiptionAction">
                <a target="_blank" data-subscriptionId="${subscriptionId}" href="${editSubscriptionLink}" class="subscriptionEditAction">Edit</a>
            </div>
        </div>
    </div>
    `
}