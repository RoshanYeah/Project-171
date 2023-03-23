var user_id = null;

AFRAME.registerComponent("markerhandler",{
    init: async function(){

        if (user_id === null) {
            this.askUserId()
        }
      
        //get the dishes collection from firestore database
        var toys = await this.getAllToys();

        this.el.addEventListener("markerFound",()=>{
            console.log("marker is found")
            this.handleMarkerFound();
        })

        this.el.addEventListener("markerLost",()=>{
            console.log("marker is lost");
            this.handleMarkerLost();
        });
    },
    askUserId: function () {
        swal({
          icon: "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png",
          title: "Would You like to see our toys?",
          text: "Choose your user id",
          content: {
            element: "input",
            attributes: {
              placeholder: "Type your user id",
              type: "number",
              min: 1
            }
          },
          closeOnClickOutside: false,
        }).then((userChoice) => {
          tableNumber = userChoice
        })
      },
    handleMarkerFound: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";

        var orderButton = document.getElementById("order-button");
        var orderSummaryButton = document.getElementById("order-summary-button");

        if(user_id != null){
            // Handling Click Events
            orderButton.addEventListener("click",()=>{
                swal({
                    icon: "https://i.imgur.com/4NZ6uLY.jpg",
                    title: "Thanks For Your Order !",
                    text: " ",
                    timer: 2000,
                    buttons: false
                });
            });

            orderSummaryButton.addEventListener("click",()=>{
                swal({
                    icon: "warning",
                    title: "Order Summary",
                    text: "Work in Progress"
                });
            });
        }
    },
    handleMarkerLost:function(){
        var buttonDiv = document.getElementById("button-div")
        buttonDiv.style.display = "none"
    },
    getAllToys: async function(){
        return await firebase
        .firestore()
        .collection()
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data)
        })
    },
    handleOrder: function(uid, toy){
        firebase
        .firestore()
        .collection("tables")
        .doc(uid)
        .get()
        .then(doc => {
          var details = doc.data()

          if(details["current_orders"][toy.id]){
            details["current_orders"][toy.id]["quantity"] +=1
    
            var currentQuantity =  details["current_orders"][toy.id]["quantity"]

            details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price

          }else{
            details["current_orders"][toy.id] = {
              item : toy.name,
              price: toy.price,
              quantity:1,
              sub_total: toy.price*1
            }
          }

          details.total_bill += toy.price;

          // Updating Db
          firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details)

        })
      }
})