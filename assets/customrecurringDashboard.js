$(async function () {

    await appendBackToDashboardMenu()
})

/**
 * Function for append Back to dashboard menu
 */
const appendBackToDashboardMenu = async () => {
    const backToDashboardHtml = await getBackToDashboardMenu();

    $('[data-testid="recharge-internal-view-your-next-order"]').parent().before(backToDashboardHtml)
}

/**
 * Function for get Order Url By multipass
 */
const getOrderUrlByMultipass = async () => {
    // Get Email or current user
    let email = ReCharge.customer.email;

    // Initialize mutlipass class
    let multipass = new ShopifyMultipass("a2732cd93529af576da1bdf4590cfd32");

    // Prepare customeData html 
    let customerData = { email: email };

    // Get mutlipass url 
    let multipass_url = multipass.generateUrl(customerData);

    return multipass_url;

}


/**
 * Function for get back to dashbaord Menu
 */
const getBackToDashboardMenu = async () => {
    let mutlipassUrl
    if (document.referrer.includes('account')) {
        mutlipassUrl = document.referrer
    } else {
        mutlipassUrl = await getOrderUrlByMultipass()
    }
    return `
    <div class="_15b7gxl0 _18gma4r0">
        <a data-testid="recharge-internal-back-to-dashboard" data-active="true" aria-current="page" href="${mutlipassUrl}">
            <div class="_15b7gxl0 _17o99wphl _17o99wphq v8i27f0">
                <div class="_15b7gxl0 _17o99wpuu _17o99wpvr _17o99wpwl _17o99wpwq _17o99wptu _17o99wptz _17o99wp6r _17o99wp7q recharge-card _17zpf480 _17zpf481">
                    <div class="_15b7gxl0 _17o99wpk6 _17o99wp0 _17o99wpli _17o99wphu _17o99wpjf _17o99wpko">
                        <span role="heading" aria-level="2" class="_15b7gxl0 recharge-heading recharge-heading-h2 _1brvylo0 _1brvylo3 _1brvylo6">
                        Back To Dashboard
                        </span>
                    </div>
                </div>
            </div>
        </a>
    </div>
    `
}