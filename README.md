# DineLine
DineLine is a restaurant order bot built in respect to AltSchool third semester assignment amongst others.

It simulates the real world order mobile application as it allow user to order their meal from wherever they are.
DineLine works with number system as it takes number as input from the `user` and return relevant information that is mapped to the number inserted.

The first order of number map are as follow
###### `1. - Place Order`
###### `99. - Checkout`
###### `98. - Order History`
###### `97. - Current Order`
###### `0. - Cancel Order`

The app takes `users` order and when you press `99` to checkout, it prompt the user for their preferred time of delivery and then proceed to `payment gateway` for `payment`

## Usage
1. open your terminal and navigate to prefered folder

2. Clone `DineLine` using `git clone https://github.com/CuriousHack/DineLine.git`

3. execute `cd dineline` in the terminal
4. press `npm install` to install all dependencies
5. `cp .env.example .env` copy the content of .env.example into .env and update the values
6. run `npm run dev` to open development server or `npm run start` to run node instance.
7. Enjoy chatting with `DineLine Bot`