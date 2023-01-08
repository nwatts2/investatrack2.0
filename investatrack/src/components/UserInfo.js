import { useState, useEffect } from 'react';
import '../css/UserInfo.css';
import profilePic from '../images/coulten.jpg';

const UserInfo  = ({ currentUser, stockTotals, range }) => {


    return (
        <div className='userInfoWrapper'>
            <div className='userTitle'>
                <div className='userTitleImage'>
                    <img src={profilePic}/>
                </div>
                <div className='userTitleText'>
                    <hr />
                    <h2>{currentUser.fname}</h2>
                    <h2>{currentUser.lname}</h2>
                    <hr />
                </div>
                <div className='userInfoSub'>
                    <span>Cash:</span>
                    <h4>{currentUser.cMoney ? currentUser.cMoney.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</h4>
                    <span>Dollar Change {'(' + range[0] + ')'}:</span>
                    <h4 className={stockTotals.change ? (stockTotals.change >= 0 ? 'positiveEntry' : 'negativeEntry') : ''}>{stockTotals.change ? (stockTotals.change >= 0 ? '+' : '') + stockTotals.change.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</h4>
                    <span>Percent Change {'(' + range[0] + ')'}:</span>
                    <h4>{stockTotals.percent ? (stockTotals.change >= 0 ? '+' : '') + stockTotals.percent.toLocaleString('en-US', {style: 'percent'}) : '0%'}</h4>
                </div>
            </div>
            <div className='userInfo'>
                <div className='userInfoHeader'>
                    <h1>Portfolio Value: {stockTotals.value ? stockTotals.value.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</h1>
                </div>
                

            </div>
        </div>
    );
}

export default UserInfo;