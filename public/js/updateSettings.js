/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const updateDetails = async (details, type) => {
    try {
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data: details
        })

        if(res.status === 200) {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
        }
    } catch (err) {
        showAlert('error',err.response.data.message);
    }
}