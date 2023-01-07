import { useState, useEffect } from 'react';
import '../css/UserInfo.css';
import profilePic from '../images/tempProfilePic.png';

const UserInfo  = ({ currentUser, stockTotals, range }) => {


    return (
        <div className='userInfoWrapper'>
            <div className='userTitle'>
                <div className='userTitleImage'>
                    <img src={profilePic}/>
                </div>
                <div className='userTitleText'>
                    <h3>Welcome to Your Portfolio,</h3>
                    <h2>{currentUser.fname + ' ' + currentUser.lname}</h2>
                </div>
            </div>
            <div className='userInfo'>
                <div className='userInfoHeader'>
                    <h1>Net Value: {stockTotals.value ? stockTotals.value.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</h1>
                </div>
                <div className='userInfoSub'>
                    <span>Cash: {currentUser.cMoney ? currentUser.cMoney.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</span>
                    <span>Dollar Change {'(' + range[0] + ')'}: {stockTotals.change ? (stockTotals.change >= 0 ? '+' : '') + stockTotals.change.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0.00'}</span>
                    <span>Percent Change {'(' + range[0] + ')'}: {stockTotals.percent ? (stockTotals.change >= 0 ? '+' : '') + stockTotals.percent.toLocaleString('en-US', {style: 'percent'}) : '0%'}</span>
                </div>

            </div>
        </div>
    );
}

export default UserInfo;