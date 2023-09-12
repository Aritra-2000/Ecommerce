import React, { Fragment, useEffect, useState } from 'react'
import "./UpdatePassword.css"
import Loader from '../layout/Loader/Loaders'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, updatePassword } from '../../actions/userAction'
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant'
import MetaData from '../layout/MetaData'
import { MdLock, MdLockOpen, MdVpnKey } from 'react-icons/md'


const UpdatePassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector((state) => state.profile)

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        // dispatch(updatePassword(oldPassword,newPassword,confirmPassword));
        dispatch(updatePassword(myForm));
    };

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Password Updated Successfully");

            navigate("/account");

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            })
        }
    }, [dispatch, error, alert, navigate, isUpdated])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className='updatePasswordHeading'>Update Profile</h2>
                            <form
                                className='updatePasswordForm'
                                onSubmit={updatePasswordSubmit}
                            >
                            <div className="OldPassword">
                                 <MdVpnKey/>
                                 <input
                                    type='password'
                                    placeholder='Old Password'
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                            />
                            </div>
                            <div className="NewPassword">
                                 <MdLockOpen />
                                 <input
                                    type='password'
                                    placeholder='New Password'
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                            />
                            </div>
                            <div className="ConfirmPassword">
                                 <MdLock />
                                 <input
                                    type='password'
                                    placeholder='Confirm Password'
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            </div>
                            <input type='submit' value='Change' className='updatePasswordBtn' />
                            </form>
                        </div>
                    </div>
                </Fragment>}
        </Fragment>
    )
}

export default UpdatePassword