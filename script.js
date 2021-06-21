'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-05-20T23:36:17.929Z',
    '2021-05-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-uk', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2021-05-25T18:49:59.371Z',
    '2021-05-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
let currentAccount;
let sort=false;
// various doc elements

const inputLoginSubmit=document.querySelector('.login__btn');
const inputLoginId=document.querySelector('.login__input--user')
const inputLoginPin=document.querySelector('.login__input--pin')
const containerApp=document.querySelector('.app');
const MovementsContainer=document.querySelector('.movements');
const sortBtn=document.querySelector('.btn--sort');
const tranferBtnSubmit=document.querySelector('.form__btn--transfer');
const transferToPerson=document.querySelector('.form__input--to');
const tranferAmount=document.querySelector('.form__input--amount');
const accountBalance=document.querySelector('.balance__value');
const introMsg=document.querySelector('.welcome');
const loanAmount=document.querySelector('.form__input--loan-amount');
const loanSubmit=document.querySelector('.form__btn--loan');
const moneyIn=document.querySelector('.summary__value--in');
const moneyOut=document.querySelector('.summary__value--out');
const IntrestMoney=document.querySelector('.summary__value--interest');
const closeAccountUser=document.querySelector('.form__input--user');
const closeAccountUserPin=document.querySelector('.form__input--pin');
const closeSubmit=document.querySelector('.form__btn--close');
const loginDate=document.querySelector('.date');
const labelTimer=document.querySelector('.timer')

// UI UPDATE
function updateUI(currentAccount,acc=accounts){
  displayMovments(currentAccount);
  calculateBalance(currentAccount);
  displayMoneySummary(currentAccount);
  // SetlocalStorage(acc);
  if(timeToLogout) clearInterval(timeToLogout);
  timeToLogout=startLogoutTimer();
}

// USERNAME
  accounts.forEach(acc=>{
    const name=acc.owner.toLowerCase().split(' ')
    acc.userName=name[0][0]+name[1][0];
  })

// DATE
function date(time){
  const timePassed=new Date(time);
  const dateOn=String(timePassed.getDate()).padStart(2,'0');
  const monthOn=String((timePassed.getMonth()+1)).padStart(2,'0');
  const yearOn=timePassed.getFullYear();
  function calcDays(time){
    return Math.floor((new Date()-timePassed)/(1000*60*60*24));
  }
  const daysPassed= calcDays(time);
  if(daysPassed==0) return 'Today';
  else if(daysPassed==1) return 'Yesterday';
  else if(daysPassed>1 && daysPassed<=7) return `${daysPassed} days ago`
  else return `${dateOn}/${monthOn}/${yearOn}`

}

// LOGIN DATE
const options={
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',
  year: 'numeric',
  
};

function login(currentAccount){
  const now=new Date();
  const locale=currentAccount.locale;
  const format=Intl.DateTimeFormat(locale,options).format(now);
  loginDate.textContent=`${format}`
}
// LOCAL STORAGE
function SetlocalStorage(accounts){
   accounts.forEach(acc=>{
     localStorage.setItem(`${acc.owner}`,JSON.stringify(acc));
   })
}
function getLocalStorage(acc){
  const owner=JSON.parse(localStorage.getItem(`${acc.owner}`));
 return owner;
}
// LOGOUT TIMER

let timeToLogout;
// there was a problem that it gets called first time after 1 sec so alag function
function startLogoutTimer(){
// set time to 5 minutes
// set intrval call  timer evrysecond
function tick(){
const min=String(Math.floor(time/60)).padStart(2,'0');
const sec=String(time%60).padStart(2,'0');
labelTimer.textContent=`${min}:${sec}`;
if(time===0) {
  clearInterval(timeToLogout);
  containerApp.style.opacity='0%';
  introMsg.textContent='Login to get started';
}
time--;
}
let time=10;
tick();
timeToLogout=setInterval(tick, 1000);
return timeToLogout;
}
// NOTE SORT MI DATES CHANGE
 console.log(accounts);
// DISPLAY MOVEMENTS
function displayMovments(account,sort=false){
  MovementsContainer.innerHTML='';
  const movs= sort? account.movements.slice().sort((a,b)=>a-b):account.movements
  console.log(`Movements = ${account.movements}`);
  movs.forEach((mov,i)=>{
    const type=mov>0? 'deposit':'withdrawal';
    const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${date(currentAccount.movementsDates[account.movements.findIndex(mo=> mo===mov)])}</div>
    <div class="movements__value">${mov}€</div>
  </div>`
  MovementsContainer.insertAdjacentHTML('afterbegin',html);
  })
}
// CALCULATE BALANCE
function calculateBalance(account){
  const balance=account.movements.reduce((acc,curr)=>acc+curr,0);
  console.log(balance);
  accountBalance.textContent=`${balance.toFixed(2)}€`
}

function calcIn(account){
  moneyIn.textContent=`${account.movements.filter(mov=>mov>0).reduce((acc,cur)=>acc+cur,0).toFixed(2)}€`
}
function calcOut(account){
  moneyOut.textContent=`${account.movements.filter(mov=>mov<0).reduce((acc,cur)=>acc+cur,0).toFixed(2)}€`
}
function calcIntrest(account){
  const intrest=account.movements.filter(mov=>mov>0).reduce((acc,cur)=>acc+cur,0)*0.1;
  IntrestMoney.textContent=`${intrest.toFixed(2)}€`
}

function displayMoneySummary(account){
  calcIn(account);
  calcOut(account);
  calcIntrest(account);
}



// LOGIN AND OTHER EVENT LISTNERS

inputLoginSubmit.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount=accounts.find(acc=>acc.userName===inputLoginId.value);
  if(!currentAccount) return ;
  if(currentAccount.pin===+inputLoginPin.value){
    containerApp.style.opacity='1';
    inputLoginId.value=inputLoginPin.value='';
    inputLoginPin.blur();
    // currentAccount=getLocalStorage(currentAccount);
    updateUI(currentAccount);
    console.log(currentAccount);
    login(currentAccount);
    introMsg.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`
  }
  else{
    alert('Account not found');
    inputLoginId.value=inputLoginPin.value='';
    inputLoginPin.blur();
  }
})

sortBtn.addEventListener('click',function(){
  sort=!sort;
  displayMovments(currentAccount,sort);
})

tranferBtnSubmit.addEventListener('click',function(e){
  e.preventDefault();
  const reciverPerson=accounts.find(acc=>acc.userName===transferToPerson.value);
  if(!reciverPerson){
   alert(`Invalid Credentials`);
   tranferAmount.value=transferToPerson.value='';
    tranferAmount.blur();
   return ;
  }
  if(currentAccount.movements.reduce((acc,curr)=>acc+curr,0)>(+tranferAmount.value) && (reciverPerson.owner!==currentAccount.owner)){
  console.log(typeof tranferAmount.value);
  reciverPerson.movements.push(+tranferAmount.value);
  currentAccount.movements.push(-(Number(tranferAmount.value)));
  currentAccount.movementsDates.push(new Date().toISOString());
  reciverPerson.movementsDates.push(new Date().toISOString());
  console.log(currentAccount);
  tranferAmount.value=transferToPerson.value='';
  tranferAmount.blur();
  updateUI(currentAccount);
  console.log(accounts);
  }
  else{
    alert('Insufficent balance');
    tranferAmount.value=transferToPerson.value='';
    tranferAmount.blur();
  }
})

loanSubmit.addEventListener('click',function(e){
  e.preventDefault();
  if(currentAccount.movements.filter(mov=>mov>0).some(mov=>mov>0.1*(+loanAmount.value))){
    setTimeout(()=>{
      console.log(typeof +loanAmount.value);
      currentAccount.movements.push(+loanAmount.value);
     currentAccount.movementsDates.push(new Date().toISOString());
     loanAmount.value='';
     loanAmount.blur();
     updateUI(currentAccount);
    },2500)
  }
  else{
    alert('Loan Not Approved')
    loanAmount.value='';
    loanAmount.blur();
  }
})

closeSubmit.addEventListener('click',function(e){
  e.preventDefault();
  if(closeAccountUser.value===currentAccount.userName && closeAccountUserPin.value==currentAccount.pin){
   const index=accounts.findIndex(acc=>closeAccountUser.value===acc.userName);
   console.log(index);
   accounts.splice(index,1);
   containerApp.style.opacity='0';
   closeAccountUserPin.value=closeAccountUser.value=''
   closeAccountUserPin.blur();
  }
  else{
    alert('Wrong details');
    closeAccountUserPin.value=closeAccountUser.value=''
    closeAccountUserPin.blur();
  }
})

