$(document).ready(function () {
    window.selectedOption = []
    /**
     * Function for select product with button
     */
    $(document).on('click', '.selectYourCoffeeCol button', function () {
        console.log('button click working')
        $(this).closest('.selectYourCoffeeCol').find('label').trigger('click')
    })

    $(document).on('click', '.selectYourCoffeeCol, .slection-step-1', function () {
        //check if selectYourCoffeeCol clicked
        var isScrollToNext = false;
        if ($(this).hasClass('selectYourCoffeeCol')) {
            let seletedProductJson = $(this).data('x-product');
            console.log(seletedProductJson.id);
            // $('.subscriptionCol input[type=radio]').prop('checked', false);
            // $(`.productOptions`).hide();
            // $(`#main-product-${seletedProductJson.id}`).show();
            isScrollToNext = true;
        }
        updateSteps(isScrollToNext);
    });
    $(document).on('click', '.gift-products-section', function () {

        updateSteps();
    });

    function updateSteps(isScrollToNext = false) {
        setTimeout(function () {
            console.log("testingkkkk")
            removeSubscriptionStepClasses();
            addCountAndSubscriptionClasses(isScrollToNext);
        }, 100); // 300 milliseconds delay

    }

  function removeSubscriptionStepClasses() {
        $('.stepsWrapper h2').each(function () {
            $(this).removeClass(function (index, className) {
                return (className.match(/(^|\s)subscriptionStep\S+/g) || []).join(' ');
            });     
        });
    }



    function addCountAndSubscriptionClasses(isScrollToNext = false) {
        var count = 1;
        $('.stepsWrapper h2:visible').each(function () {
            var text = $(this).text();
            var newText = text.replace(/^\d+\.\s*/, '');
            var finalText = count + ". " + newText;

            $(this).text(finalText);
            $(this).attr("currentStep", count);
            $(this).addClass(`subscriptionStep${count}`);

            count++;
        });

        if (isScrollToNext) {
            if ($('.subscriptionStep3').length) {

                scrollToNextStep($('.subscriptionStep3'));
            }
        }
    }


    $(document).on('change', 'input[type="radio"]', async function (e) {

        // Get the ID of the next step
        var NextStep = parseInt($(this).parents(".subscriptionOption").find("h2").attr("currentstep")) + 1;
        //conver to string
        NextStep = NextStep.toString();
        var nextStepClass = `.subscriptionStep${NextStep}`;
        // Get the name of the selected radio button
        var selectedStepName = $(this).attr('name');

        switch (selectedStepName) {
            case 'whoisThisFor':
                // Assign Seleted Step Name
                window.selectedProductType = $(this).val();
                if (window.selectedProductType == 'forGift') {
                    $('#stepsWrapperForMySelf, .for-myself-steps').hide();
                    $('#stepsWrapperFoGiftSomeone').show();
                    $('.stickyFooterSection').hide();
                    $('.coffeeSubscriptionCheckout').hide();
                    // Move to Next Step
                    // scrollToNextStep($(`${nextStepClass}`))
                    // 
                    // $('label[for="signature_blends"]').click();
                    scrollToNextStep($('#productSelectYourCoffeeStepGift'))

                } else {
                    $('#stepsWrapperFoGiftSomeone').hide();
                    $('#stepsWrapperForMySelf, .for-myself-steps').show();
                    //productNameStep

                    // $('.stickyFooterSection').show();
                    $('.coffeeSubscriptionCheckout').show();
                    // Move to Next Step
                    scrollToNextStep($('#productSelectYourCoffeeStep'))
                }
                // Try to get the value of the checked visible input
                var selectedValue = jQuery('input[name="selectYourCoffee"]:visible:checked').val();

                // If the selected value is undefined, get the value of the first visible input with the same name
                if (typeof selectedValue === 'undefined') {
                    //mark 1st as selected
                    selectedValue = jQuery('input[name="selectYourCoffee"]:visible').first().prop('checked', true).trigger('change');;
                }
                break;
            case 'selectYourCoffee':
                window.seletedProductJson = $(this).parent().data('x-product')
                $('.grind-type, .coffee-weight, .coffee-frq').addClass("display-none-needed")
                $(`#grind-type-${window.seletedProductJson.id}`).removeClass("display-none-needed")
                $(`#coffee-weight-${window.seletedProductJson.id}`).removeClass("display-none-needed")
                $(`#coffee-frq-${window.seletedProductJson.id}`).removeClass("display-none-needed")
                $(`.coffeeSubscriptionCheckout`).html(`<span> add to cart($0.00) </span>`)
                $('#stepsWrapperFoGiftSomeone .productOptions').addClass("display-none-needed")
                $('#stepsWrapperForMySelf .productOptions').addClass("display-none-needed")
                $(`#main-product-${window.seletedProductJson.id}`).removeClass("display-none-needed")
                const haveCoffeTypeOption = $(`#product-type-step-${window.seletedProductJson.id}`)
                
                if (haveCoffeTypeOption.length) {
                    haveCoffeTypeOption.show()
                    // Move to Next Step
                    if (window.selectedProductType == 'forGift') {
                        scrollToNextStep($(`${nextStepClass}`))

                        // scrollToNextStep($(`#main-product-${window.seletedProductJson.id}`))
                    } else {

                        $(`#coffee-frq-${window.seletedProductJson.id}`).show();
                    }
                    break;
                } else {
                    if (window.selectedProductType == 'forGift') {

                        scrollToNextStep($(`${nextStepClass}`))
                        // scrollToNextStep($(`#gift-products-${$(this).val()}`))
                        break;
                    } else {
                        $('.productTypeStep').hide()

                        break;
                    }
                }
            case 'beanOrGround':
                window.selectedOption.push($(this).val())
                // Move to Next Step
                scrollToNextStep($(`${nextStepClass}`))
                break;
            case 'coffeeBag':
                // Move to Next Step
                scrollToNextStep($(`${nextStepClass}`))
                break;
            case 'coffeeYouWant':
                window.selectedOption.push($(this).val())
                // Move to Next Step
                scrollToNextStep($(`${nextStepClass}`))
                break;
            case 'productType':
                window.selectedOption.push($(this).val())
                console.log(window.selectedOption)
                // Move to Next Step
                $(this).prop('checked', true)
                scrollToNextStep($(`${nextStepClass}`))
                break;
            //selectYourCoffeeType
            case "selectYourCoffeeType":
                $('.gift-products-section').addClass('ck-hide');
                $(`#gift-products-${$(this).val()}`).removeClass("ck-hide");
                // scrollToNextStep($(`#main-product-${$(this).val()}`))
                $('stepsWrapperFoGiftSomeone').p
                if (window.selectedProductType == 'forGift') {
                    scrollToNextStep($(`${nextStepClass}`))

                    // scrollToNextStep($(`#main-product-${$(this).val()}`))

                }
                break;
            // case 'howOften':
            //     //const checkedValues = getCheckedRadioValues();
            //     //const selectedVariation = findMatchingVariation(checkedValues, window.seletedProductJson.variants)
            //     break;
            case 'giftProductSize':
                console.log(window.seletedProductJson.id)
                // Move to Next Step
                if ($(`#type-${window.seletedProductJson.id}`).length) {

                    scrollToNextStep($(`#stepsWrapperFoGiftSomeone #type-${window.seletedProductJson.id}`))
                } else {
                    scrollToNextStep($(`#stepsWrapperFoGiftSomeone #grind-type-${window.seletedProductJson.id}`))

                }
                break;
            case 'howoftengift':
                // Show the product details page
                $('#giftRecipientDetailStep').show();

                // Move to Next Step
                scrollToNextStep($(`${nextStepClass}`))
                // scrollToNextStep($('#giftRecipientDetailStep'))
                break;
        }

        setCheckoutLineItems();
    })


    function getCheckedRadioValues() {
        const values = [];
        $('input[name="coffeeYouWant"]:visible:checked, input[name="beanOrGround"]:visible:checked, input[name="productType"]:visible:checked').each(function () {
            values.push($(this).val());
        });
        return values;
    }
    function setCheckoutLineItems() {
        const checkedValues = getCheckedRadioValues();
        let matchedVariation = false;

        if (window.seletedProductJson && $('input[name="howOften"]:visible:checked').length) {
            matchedVariation = findMatchingVariation(checkedValues, window.seletedProductJson.variants);
            console.log(matchedVariation)
            if (matchedVariation) {
                const quantity = $(`input[name="coffeeBag"]:checked`).val();

                if (quantity && parseInt(quantity) > 0) {
                    matchedVariation.quantity = quantity;
                }

                const checkoutLineItemObj = getCheckoutLineItem(matchedVariation, $('input[name="howOften"]:visible:checked').val());
                window.checkoutLineItemObj = checkoutLineItemObj;
                $(`.coffeeSubscriptionCheckout`).html(`<span> add to cart($${matchedVariation.price / 100}) </span>`);
                $('.stickyFooterSection').show();
            } else {
                $(`.coffeeSubscriptionCheckout`).html(`<span> add to cart($0.00) </span>`);
            }
        }
    }


    /**
  * Event Trigger When user want to checkout 
  */
    $(document).on('click', `.coffeeSubscriptionCheckout`, async function (e) {
        e.preventDefault()

        var selectedVariationArr = [];
        const productJson = $(`input[name="selectYourCoffee"]:checked`).parent().data('x-product')

        if (!productJson) {
            alert('Please Select any product')
            return;
        }

        const beanOrGround = $(`input[name="beanOrGround"]:checked`).val();

        const coffeeYouWant = $(`input[name="coffeeYouWant"]:checked`).val();

        const howOften = $(`input[name="howOften"]:checked`).val();

        const coffeType = $(`input[name="productType"]:visible:checked`).val();

        if (!beanOrGround || !coffeeYouWant || !howOften) {
            alert('Please Select any option')
            return;
        }

        selectedVariationArr.push(beanOrGround, coffeeYouWant)

        if (coffeType) {
            selectedVariationArr.push(coffeType)
        }

        const selectedVariation = findMatchingVariation(selectedVariationArr, productJson.variants)
        const checkoutLineItemObj = getCheckoutLineItem(selectedVariation, howOften);
        const response = await addItemAndRedirectToCheckout(checkoutLineItemObj);
        // if (response) {
        //     window.location.href = '/checkout';
        // }

    })

    $(document).on('click', '#submitGiftSubscripition', async function (e) {
        e.preventDefault();

        const productJson = $(`input[name="selectYourCoffee"]:checked`).parent().data('x-product')
        const weight = $(`input[name="selectYourCoffee"]:checked`).parent().data('weight')

        // const giftProductSize = $(`input[name="giftProductSize"]:checked`).val();
        // const freq = $(`input[name="howoftengift"]:checked`).val();
        const months = $(`input[name="productType"]:checked`).val();
        const bags = $(`input[name="beanOrGround"]:checked`).val();
        // console.log(freq)

        const weekPlan = $(`input[name="howoftengift"]:checked`).val();

        // Call the validateAndReturnValues function
        const recipientFormData = validateAndReturnValues('#giftRecipientContactsForm input');

        console.log(productJson.variants)
        // const selectedVariation = productJson.variants.find((item) => item.options[0] === giftProductSize || item.options[1] === giftProductSize)
        const selectedVariation = productJson.variants.find((item) => (item.options[0] == weekPlan || item.options[1] == weekPlan || item.options[2] == weekPlan) && (item.options[0] == months || item.options[1] == months || item.options[2] == months) && (item.options[0] == bags || item.options[1] == bags || item.options[2] == bags))
        console.log(selectedVariation)
        // const selectedSellingOptions = productJson.selling_plan_groups.find((item) => extractNumberFromString(item.name) === weekCount)

        const checkoutLineItemObj = getCheckoutLineItem(selectedVariation);
        checkoutLineItemObj.append('properties[Frequency]', weekPlan)
        // checkoutLineItemObj.append('properties[Weight]', weight)
        checkoutLineItemObj.append('properties[__rc_gift_notification_scheduled_at]', `${recipientFormData.giftScheduledAtDate}T00:00:00`)
        checkoutLineItemObj.append('properties[__rc_gift_recipient_email]', recipientFormData.recipientEmail)
        checkoutLineItemObj.append('properties[__rc_gift_recipient_first_name]', recipientFormData.recipientFirstName)
        checkoutLineItemObj.append('properties[__rc_gift_recipient_last_name]', recipientFormData.recipientLastName)
        checkoutLineItemObj.append('properties[__rc_gift_recipient_note]', '')
        checkoutLineItemObj.append('properties[__rc_gift_sender_name]', `${recipientFormData.senderFirstName} ${recipientFormData.senderLastName}`)

        const response = await addItemAndRedirectToCheckout(checkoutLineItemObj)
        console.log(response);
        if (response) {
            // window.location.href = '/checkout';
        }
    })
});

const extractNumberFromString = (inputString) => {
    // Regular expression pattern to match numbers
    const pattern = /\d+/;

    // Find the first match of the pattern in the input string
    const match = inputString.match(pattern);

    // If a match is found, return the number (parsed as integer)
    if (match) {
        return parseInt(match[0], 10);
    } else {
        // If no match is found, return NaN (Not a Number)
        return NaN;
    }
}

const validateAndReturnValues = (selector) => {
    let formData = {};
    let isValid = true;

    // Iterate over each input field in the form
    $(selector).each(function () {
        // Check if the input field is empty
        if ($(this).val() === '') {
            // Add error message below the input field
            $(this).after('<span class="error" style="color:red;margin-top:5px">This field is required</span>');
            // Set isValid to false if any field is empty
            isValid = false;
        } else {
            // Remove any existing error messages
            $(this).next('.error').remove();
            // Add the field value to the formData object
            formData[$(this).attr('name')] = $(this).val();
        }
    });

    // If any field is empty, return null
    if (!isValid) {
        return null;
    }

    // Return the formData object if all fields are filled
    return formData;
}

const findMatchingVariation = (options, variations) => {
    return variations.find(variation => {
        // Compare the option_values array in the variation with the provided options array
        const optionValuesMatch = variation.options.every(value => options.includes(value));

        return optionValuesMatch;
    });
};
/**
 * Scroll Down window to disired steps
 */
const scrollToNextStep = (nextStep) => {
    // Get the height of the headerContainer
    var headerContainerHeight = $('#headerContainer').height();
    // console.log(nextStep.offset().top - headerContainerHeight)
    // Scroll to the next step
    // Check if nextStep exists

    if ($('.stepsWrapper').length && nextStep.length) {
        console.log(nextStep)
        $('.stepsWrapper').animate({
            scrollTop: $('.stepsWrapper').scrollTop() + nextStep.offset().top - $('.stepsWrapper').offset().top
            // scrollTop: nextStep.offset().top
        }, 300); // Adjust the animation speed as needed
    }
}

/**
 * Function for Get Checkout Line Items To get directly checkout
 */
const getCheckoutLineItem = (variation, sellingPlanId = false) => {
    const dataArray = [
        ['id', variation.id],
        ['quantity', variation.quantity],
    ];

    if (sellingPlanId) {
        dataArray.push(['selling_plan', sellingPlanId])
    }
    const formData = createFormData(dataArray);
    return formData
}


const createFormData = (dataArray) => {
    const formData = new FormData();

    dataArray.forEach(([key, value]) => {
        formData.append(key, value);
    });

    return formData;
}

/**
 * Function for add Item to cart and redirect it to checkout 
 */
const addItemAndRedirectToCheckout = async (checkoutJson) => {
    try {
        const response = await fetch(`${window.location.origin}/cart/add.js`, {
            method: 'POST',
            body: checkoutJson,
        });

        // Check if the request was successful (status code in the range of 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for handling in the calling code if needed
    }
}