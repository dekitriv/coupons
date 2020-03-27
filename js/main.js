var allData = null; // svi iz jsona
var idKategorije = 0; //pocetno prikazati sve
var minPrice = null; // min price za price slider
var maxPrice = null; // max price za price slider
var boxView = 0 // 0-BoxView 1-ListView
var isCouponUsed = 0 // 0-ne 1-da

jQuery(document).ready(function($){

    // jQuery sticky Menu
	$(".mainmenu-area").sticky({topSpacing:0});
    $('.product-carousel').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:3,
            },
            1000:{
                items:5,
            }
        }
    });  
    $('.related-products-carousel').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2,
            },
            1000:{
                items:2,
            },
            1200:{
                items:3,
            }
        }
    });  
    $('.brand-list').owlCarousel({
        loop:true,
        nav:true,
        margin:20,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:3,
            },
            1000:{
                items:4,
            }
        }
    });    
    // Bootstrap Mobile Menu fix
    $(".navbar-nav li a").click(function(){
        $(".navbar-collapse").removeClass('in');
    });    
    // jQuery Scroll effect
    $('.navbar-nav li a, .scroll-to-up').bind('click', function(event) {
        var $anchor = $(this);
        var headerH = $('.header-area').outerHeight();
        $('html, body').stop().animate({
            scrollTop : $($anchor.attr('href')).offset().top - headerH + "px"
        }, 1200, 'easeInOutExpo');

        event.preventDefault();
    });    
    // Bootstrap ScrollPSY
    $('body').scrollspy({ 
        target: '.navbar-collapse',
        offset: 95
    })  




    //      -------------------------- MOJ JS ------------------------------

$.ajax({
    url: "data/products.json",
    dataType: "json",
    type: "get",
    success: function(data){
        allData = data;
        if(location.href.includes("shop.html")){
            ispis(allData);
            ispisKategorija(allData);
            ispisFilteraZaCenu(allData);
        }
        if(location.href.includes("single-product.html")){
            ispisiSingleProduct();
        }
    },
    error: function(err){
        console.error(err)
    }
});

updateZbirProizvodaUKorpi();



//           -------------------------- Dodeljivanje dogadjaja -----------------------
$("#ddlSort").change(filtriraj);

$("#tbSearch").keyup(filtriraj);
if (event.keyCode == 8  || event.keyCode == 46) {   //space-8 delete-46
    filtriraj()
};

$("#updatePriceFilter").click(filtriraj);

$("#list-view").click(function(e){
    e.preventDefault();
    //console.log("jej");
    $(this).find("i").addClass("active");
    $("#box-view").find("i").removeClass("active");
    $(".product").addClass("horizontal");
    boxView = 1;
})

$("#box-view").click(function(e){
    e.preventDefault();
    //console.log("jej");
    $(this).find("i").addClass("active");
    $("#list-view").find("i").removeClass("active");
    $(".product").removeClass("horizontal");
    boxView = 0
})

$("#buy").click(validate);

});


function ispis(products, id){
    //console.log(products)
    
    if(products.length == 0){
        let html= `<p>Sorry, we dont have products that match your criteria</p>`
        document.getElementById("products").innerHTML = html;
    }
    else{
        let html = "";
        for(let product of products){
            html += `
            <div class="col-md-4 col-sm-6 product">
                <div class="single-shop-product">
                    <div class="product-upper">
                        <img src="img/${product.slika.src}" alt="${product.slika.alt}"/>
                    </div>
                    <div class="product-down">
                        ${ispisiZvezdice(product.rating)}
                        <h5>${product.naslov}</h5>
                        <p>${product.opis}</p>
                        <div class="product-carousel-price">
                            <ins>$${product.cena.nova}</ins> <del>$${product.cena.stara}</del>
                        </div>  
                        
                        <div class="product-option-shop">
                            <a class="add_to_cart_button" data-product_id="${product.id}" rel="nofollow" href="#">Add to cart</a>
                            <a class="view_detailed" rel="nofollow" href="single-product.html?id=${product.id}">View details</a>
                        </div> 
                    </div>                       
                </div>
            </div>
        `
        }
        if(id){
            document.getElementById(id).innerHTML = html;
        }
        else{
            document.getElementById("products").innerHTML = html;
        }

        $(".product").hover( function(){
            $(this).css({
                "transform": "translate3d(0, -5px, 0)",
                "box-shadow": "0 4px 2px rgba(0,0,0,0.25)",
                "transition": "0.25s"})
        }, function(){
            $(this).css({
                "transform": "translate3d(0, 0, 0)",
                "box-shadow": "0 1px 1px rgba(0,0,0,0.2)"})
        })

        $(".product-option-shop .add_to_cart_button").click(dodajULocalStorage);
    }
    if(boxView){
        $("#list-view").trigger("click");
    }else{
        $("#box-view").trigger("click");
    }
}

function ispisiZvezdice(ocena){
    let deljenik = [0, 0.2, 0.4, 0.6, 0.8, 1]
    let html = `<ul class='rating' title="${ocena}">`;
    for(let i=0; i<Math.floor(ocena); i++){
        html += `<li><i class="fas fa-star"></i></li>`
    };
    if(!deljenik.includes(ocena/5)){
        html += `<li><i class="fas fa-star-half-alt"></i></li>`
    }
    for(let i=0; i<Math.floor(5-ocena); i++){
        html += `<li><i class="far fa-star"></i></li>`
    }
    html += "</ul>"
    return html;
}

function ispisKategorija(products){
    // let array = [];
    // for(let product of products){
    //     console.log(product.kategorija)
    //     array.push(product.kategorija)
    // }
    let array = products.map( x => x.kategorija);
    console.log(array);
    array = array.filter((element, index, kategorije)=>kategorije.findIndex(temp=>(temp.id === element.id))===index);
    console.log(array);
    let html = `<h3 class="mb-5">Categories</h3>
                <ul>
                    <li>
                        <a href="#" data-categoryid="0">
                        <i class="fas fa-tasks"></i>
                        <p>all products</p>
                        </a>
                    </li>`;
    for(let kategorija of array){
        html += `
        <li>
            <a href="#" data-categoryid="${kategorija.id}">
                <i class="${kategorija.fafa}"></i>
                <p>${kategorija.naziv}</p>
            </a>
        </li>
        `;
    }
    html += `</ul>`;
    document.getElementById("filterByCategories").innerHTML = html;
    $("#filterByCategories a").click(filtriraj);
    $("#filterByCategories a").hover(function (){
        $(this).css({"padding-left": "10px",
                    "color": "#48aad6"})        
    }, function (){
        $(this).css({"padding-left": "0px", "color": "#666"})
    })
}

function ispisFilteraZaCenu(products){
    var nizCena = products.map(x => x.cena.nova);
    minPrice = Math.min(...nizCena);
    maxPrice = Math.max(...nizCena);
        $(".js-range-slider").ionRangeSlider({
            type: "double",
            min: minPrice,
            max: maxPrice,
            from: minPrice,
            to: maxPrice,
            skin: "sharp",
            prefix: "$",
            onFinish: function(data){
                minPrice = data.from;
                maxPrice = data.to;
            }
        });
        $(".js-range-slider").ionRangeSlider();
}

function filtriraj(e){
    e.preventDefault();
    //let tempData = allData;
    let tempData = JSON.parse(JSON.stringify(allData)); // deep copying!!!
    // console.log(typeof this);
    // console.log(String(this))
    // ------------------------------------- Filtriranje po kategoriji

    // ako je kliknuto na link, sortirati po kategoriji
    if(String(this).includes("http")){
        idKategorije = $(this).data("categoryid"); 
    }
    if(idKategorije != 0){
        tempData = tempData.filter(prod => prod.kategorija.id == idKategorije);
    }
    // ------------------------------------- Filtriranje po nazivu/search

    let searchInput = $("#tbSearch").val().trim().toLowerCase();
    if(searchInput){
        tempData = tempData.filter(prod => prod.naslov.toLowerCase().includes(searchInput) || prod.opis.toLowerCase().includes(searchInput));
    }

    // ------------------------------------- Filtriranje po ceni

    tempData = tempData.filter(prod => {
        if(prod.cena.nova >= minPrice && prod.cena.nova <= maxPrice){
            return true;
        }
        return false;
    })
    // ------------------------------------- Sortiranje
    let ddlSortValue = $("#ddlSort").val();
    // if(ddlSortValue == 0){
    //     // tempData.sort((a,b) => {
    //     //     if(a.id == b.id) return 0;
    //     //     return a.id > b.id ? 1 : -1;
    //     // })
    // }
    if(ddlSortValue == 1){
        tempData.sort((a,b) => {
            if(a.rating == b.rating) return 0;
            return a.rating > b.rating ? -1 : 1;
        })
    }
    else if(ddlSortValue == 2){
        tempData.sort((a,b) => {
            if(a.cena.nova == b.cena.nova) return 0;
            return a.cena.nova > b.cena.nova ? 1 : -1;
        })
    }
    else if(ddlSortValue == 3){
        tempData.sort((a,b) => {
            if(a.cena.nova == b.cena.nova) return 0;
            return a.cena.nova > b.cena.nova ? -1 : 1;
        })
    }
    else if(ddlSortValue == 4){
        tempData.sort((a,b) => {
            if(a.naslov.toLowerCase() == b.naslov.toLowerCase()) return 0;
            return a.naslov.toLowerCase() > b.naslov.toLowerCase() ? -1 : 1;
        })
    }
    else if(ddlSortValue == 5){
        tempData.sort((a,b) => {
            if(a.naslov == b.naslov) return 0;
            return a.naslov.toLowerCase() > b.naslov.toLowerCase() ? 1 : -1;
        })
    }
    // console.log(tempData)
    // console.log(allData)
    
    ispis(tempData);   
}
function dodajULocalStorage(e){
    e.preventDefault();
    let idProizvoda = $(this).data("product_id");
    let currentLocalStorage = dohvatiSveProizvodeLS();
    //console.log(idProizvoda);
    let objectProduct = allData.filter(x => x.id === idProizvoda);
    //console.log(objectProduct[0].id)
    if(!currentLocalStorage){
        //console.log("jej");
        objectProduct[0].quantity = 1;
        //console.log(objectProduct);
        localStorage.setItem("cartItems", JSON.stringify(objectProduct));
    }else{
        let isInCart = currentLocalStorage.some(x => x.id === idProizvoda);
        //console.log(isInCart)  
        if(!isInCart){
            objectProduct = objectProduct[0];
            objectProduct.quantity = 1;
            currentLocalStorage.push(objectProduct)
            console.log("jej")
        }else{
            currentLocalStorage = currentLocalStorage.map(x => {
                if(x.id === idProizvoda){
                    x.quantity += 1;
                }
                return x;
            });
        } 
        localStorage.setItem("cartItems", JSON.stringify(currentLocalStorage));
    }
    updateZbirProizvodaUKorpi();
}
if(location.href.includes("cart.html")){
    (function ispisUCart(products){
        let html = "";
        for(let product of products){
            html += `
            <tr class="cart_item">
                <td class="product-remove">
                    <a title="Remove this item" class="remove" href="#" data-productid="${product.id}">×</a> 
                </td>

                <td class="product-thumbnail">
                    <a href="single-product.html"><img width="145" height="145" alt="${product.slika.alt}" class="shop_thumbnail" src="img/${product.slika.src}"></a>
                </td>

                <td class="product-name">
                    <a href="single-product.html">${product.naslov}</a> 
                </td>

                <td class="product-price">
                    <span id="amountFor${product.id}" class="amount">$${product.cena.nova}</span> 
                </td>

                <td class="product-quantity">
                    <div class="quantity buttons_added">
                        <input data-productid="${product.id}" type="button" class="minus" value="-">
                        <input data-productid="${product.id}" data-sumdivid="totalFor${product.id}" type="number" size="4" class="input-text qty text productQuantity" title="Qty" value="${product.quantity}" min="1" step="1">
                        <input data-productid="${product.id}" type="button" class="plus" value="+">
                    </div>
                </td>

                <td class="product-subtotal">
                    <span id="totalFor${product.id}" class="amount">$${product.quantity*product.cena.nova}</span> 
                </td>
            </tr>
            
            `
        }
        html += `<tr>
        <td class="actions" colspan="6">
            <div class="coupon">
                <label for="coupon_code">Coupon:</label>
                <input type="text" placeholder="Coupon code" value="" id="coupon_code" class="input-text" name="coupon_code">
                <input type="button" value="Apply Coupon" id="apply_coupon" name="apply_coupon" class="button">
            </div>
            <input type="button" value="Proceed to Checkout" name="proceed" class="checkout-button button alt wc-forward" data-toggle="modal" data-target="#exampleModal">
        </td>
    </tr>`;
        document.getElementById("cartProducts").innerHTML = html;

        $(".plus").click(function(){
            let val = parseInt(this.previousElementSibling.value);
            this.previousElementSibling.value = val+1;
            $(this).prev().trigger("change");
        });
        $(".minus").click(function(){
            let val = parseInt(this.nextElementSibling.value);
            if(val <= 1){
                return
            }
            this.nextElementSibling.value = val-1;
            $(this).next().trigger("change");
        })
        $(".productQuantity").change(function(){
            let idProizvoda = $(this).data("productid");
            let id = $(this).data("sumdivid");
            let quantity = this.value;
            let products = dohvatiSveProizvodeLS();
            var price = products.filter(x => x.id == idProizvoda)[0].cena.nova;
            //console.log(price)
            document.getElementById(id).innerText = "$" + quantity * price;
            let updatedForLocalStorage = products.map(x => {
                if(x.id === idProizvoda){
                    x.quantity = parseInt(quantity);
                }
                return x;
            })
            //console.log(updatedForLocalStorage)
            localStorage.setItem("cartItems", JSON.stringify(updatedForLocalStorage));
            updateZbirProizvodaUKorpi();
        });
        $(".remove").click(function(e){
            e.preventDefault();
            let products = dohvatiSveProizvodeLS();
            let idProizvoda = $(this).data("productid");
            let updatedForLocalStorage = products.filter(x => x.id != idProizvoda);
            this.closest("tr").remove();
            localStorage.setItem("cartItems", JSON.stringify(updatedForLocalStorage));
            updateZbirProizvodaUKorpi();
        })
        $("#apply_coupon").click(updateZbirProizvodaUKorpi);

    })(dohvatiSveProizvodeLS());
}
function updateZbirProizvodaUKorpi(){
    let productsLocalStorage = dohvatiSveProizvodeLS();
    //ukupan quantity proizvoda
    let countProizvoda = productsLocalStorage.reduce((total, curr) => total + curr.quantity, 0);
    //console.log(countProizvoda)
    document.getElementById("cartCount").innerText = countProizvoda;
    //ukupna cifra
    let totalSum = productsLocalStorage.reduce((total, curr) => total + curr.quantity * curr.cena.nova, 0);

    // ----------------------------- Kuponi (ne vaze za localstorage)
    if($("#coupon_code").val()){
        let coupons = ["disc10", "disc20", "disc30", "disc40"];
        let userInputForCoupon = document.getElementById("coupon_code").value.trim();
        if(coupons.includes(userInputForCoupon)){
            if(userInputForCoupon === "disc10") totalSum *= 0.9;
            if(userInputForCoupon === "disc20") totalSum *= 0.8;
            if(userInputForCoupon === "disc30") totalSum *= 0.7;
            totalSum = totalSum.toFixed();
        }
    }
    //console.log(totalSum);
    document.getElementById("cartTotal").innerText = "$" + totalSum;
    $(".cart_totals .amount").text("$" + totalSum);
}

function dohvatiSveProizvodeLS(){
    return JSON.parse(localStorage.getItem("cartItems"));
};

function validate(){
    let FN = document.getElementById("billing_first_name");
    let LN = document.getElementById("billing_last_name");
    let adress1 = document.getElementById("billing_address_1");
    let adress2 = document.getElementById("billing_address_2");
    let state = document.getElementById("billing_state");
    let zip = document.getElementById("billing_postcode");
    let email = document.getElementById("billing_email");
    let phone = document.getElementById("billing_phone");

    // let valueFN = FN.value.trim();
    // let valueLN = LN.value.trim();
    // let valueAdress1 = adress1.value.trim();
    // let valueAdress2 = adress2.value.trim();
    // let valueState = state.value.trim();
    // let valueZip = zip.value.trim();
    // let valueEmail = email.value.trim();
    // let valuePhone = phone.value.trim();

    let regexName = /^[A-ZĐŠĆČŠ][a-zđšžćč]{2,15}(\s[A-ZĐŠĆČŠ][a-zđšžćč]{1,15})*$/;
    let regexAdress2 = /^([\s]{0,1}[A-ZĐŠĆČŠ][a-zđšžćč]{1,15})+\s[\d]{1,4}$/;
    let regexZip = /^[\d]{5}$/;
    let regexEmail = /^[A-z\d\-\.\_]{1,150}@[a-z]{2,10}(\.[a-z]{2,10}){1,3}$/;
    let regexPhone = /^\+?[\d]{9,15}$/;

    var isValid = false;

    testRegex(LN, regexName, "Last name");
    testRegex(FN, regexName, "First name");
    testRegex(adress1, regexName, "City");
    testRegex(adress2, regexAdress2, "Adress");
    testRegex(state, regexName, "Country/State");
    testRegex(zip, regexZip, "Zip");
    testRegex(email, regexEmail, "Email");
    testRegex(phone, regexPhone, "Phone");

    function testRegex(id, regex, fullname){
        if(!regex.test(id.value.trim())){
            id.nextSibling.remove();
            id.after(`${fullname} is not valid.`);
            isValid = false;
            id.parentElement.style.color = "#F32013";
        }
        else{
            id.nextSibling.remove();
            isValid = true;
            id.parentElement.style.color = "#333";

        }
    }
}

function ispisiSingleProduct(){
    let html = "";
    let idProduct = location.href.split("?id=")[1];
    let prod = allData.filter(x => x.id == idProduct)[0];
    html += `
    <div class="col-md-10 col-md-offset-1">
    <div class="col-md-7">
        <div class="product-images">
            <div class="product-main-img">
                <img src="img/${prod.slika.src}" alt="${prod.slika.alt}">
            </div>
        </div>
    </div>
    
    <div class="col-md-5">
        <div class="product-inner filter-box">
            <div class="zvezdice">
                ${ispisiZvezdice(prod.rating)}
            </div>
            <h2 class="product-name">${prod.naslov}</h2>
            
            <div class="product-inner-price">
                <ins>$${prod.cena.nova}.00</ins> <del>$${prod.cena.stara}.00</del>
            </div>    
            <div class="fs16">
                <a class="add_to_cart_button" data-product_id="${prod.id}" rel="nofollow" href="#">Add to cart</a>
            </div>
                                    
            <div role="tabpanel">
                <ul class="product-tab" role="tablist">
                    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Description</a></li>
                    <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Reviews</a></li>
                </ul>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane fade in active" id="home">
                        <h2>Product Description</h2>  
                        <p>${prod.opisBig}</p>
                    </div>
                    <div role="tabpanel" class="tab-pane fade" id="profile">
                        <h2>Reviews</h2>

                            
                        <div class="submit-review">
                            <form action="anketa.php" method="post" onsubmit="return proveraAnkete()">
                                <input type="hidden" name="idUser" value="15">

                                <input type="hidden" name="idProizvod" value="1">

                                <p><label for="name">Name</label> <input name="name" id="reviewName" type="text"> </p>
                                

                                <p><label for="email">Email</label> <input name="email" id="reviewEmail" type="email" value=""></p>

                                <p><label for="review">Your review</label> <textarea name="review" id="reviewReview" cols="30" rows="10"></textarea> </p>
                                

                                <p><input type="submit" value="Submit" name="btnReview"></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h3>Related Products</h3>
    <div id="similarProducts">
    </div>
</div>

    `
    $("#singleProduct").html(html);
    let similarProductsArr = allData.filter(x => prod.kategorija.id == x.kategorija.id && prod.id != x.id);
    console.log(similarProductsArr)
    ispis(similarProductsArr, "similarProducts")
};

