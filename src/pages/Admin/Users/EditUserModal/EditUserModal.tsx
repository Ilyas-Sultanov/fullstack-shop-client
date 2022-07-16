import './EditUserModal.scss';
import { ChangeEvent, FormEvent, useEffect, useState, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import Card from '../../../../components/UI/Card/Card';
import Modal from '../../../../components/UI/Modal/Modal';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import Spinner from '../../../../components/UI/Spninner/Spinner';
import CheckboxRadio from '../../../../components/UI/Checkbox-Radio/CheckboxRadio';
import { IEditingUser } from '../../../../store/reducers/users/users';
import { IRoleDataItem } from '../../../../types/RoleTypes';
import { IEditUserValidationMessages } from '../../../../store/reducers/users/users';
import { editUser } from '../../../../store/reducers/users/usersActionCreators';
import { usersActions } from '../../../../store/reducers/users/users';
import validation from '../../../../helpers/validation';

interface IEditUserModalProps {
    user: IEditingUser
    validationMessages: IEditUserValidationMessages
    roles: IRoleDataItem[]
    isLoading: boolean
    children?: never
    onClose: () => void
}

function EditUserModal({user, roles, isLoading, validationMessages, onClose}: IEditUserModalProps) {
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState(false);

    // name
    const changeName = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const name = e.target.value;
            const nameMessages = validation(name, {isEmpty: true, minLength: 2, maxLength: 15});
            if (nameMessages.length) dispatch(usersActions.setEditValidationMessages({name: nameMessages}));
            else dispatch(usersActions.setEditValidationMessages({name: []}));
            dispatch(usersActions.updateEditingUser({name: name}));
        },
        [dispatch]
    );
   
 
    // email
    const changeEmail = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const email = e.target.value;
            const emailMessages = validation(email, {isEmpty: true, minLength: 3, maxLength: 50, isEmail: true});
            if (emailMessages.length) dispatch(usersActions.setEditValidationMessages({email: emailMessages}));
            else dispatch(usersActions.setEditValidationMessages({email: []}));
            dispatch(usersActions.updateEditingUser({email: email}));
        },
        [dispatch]
    );
   

    // password
    const changePassword = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const password = e.target.value;
            if (password) {
                const passwordMessages = validation(password, {minLength: 5, maxLength: 20});
                if (passwordMessages.length) dispatch(usersActions.setEditValidationMessages({password: passwordMessages}));
                else dispatch(usersActions.setEditValidationMessages({password: []}));
            }
            else {
                if (validationMessages.password) dispatch(usersActions.setEditValidationMessages({password: []}));
            }
            dispatch(usersActions.updateEditingUser({password: password}));
        },
        [dispatch, validationMessages.password]
    );
    

    // roles
    const changeRoles = useCallback(
        function changeRoles(e: ChangeEvent<HTMLInputElement>) {
            const value = e.target.value;
            const roles = [...user.roles];
            if (roles.includes(value)) {
                const idx = roles.findIndex((item) => item === value);
                if (idx > -1) roles.splice(idx, 1);
            }
            else roles.push(value);
            if (roles.length < 1) dispatch(usersActions.setEditValidationMessages({roles: 'Должна быть выбрана хотябы одна роль'}));
            else if (validationMessages.roles !== '') dispatch(usersActions.setEditValidationMessages({roles: ''}));
            dispatch(usersActions.updateEditingUser({roles: roles}));
        },
        [dispatch, user.roles, validationMessages.roles]
    );
    

    // isValid
    useEffect(
        function() {
            let isValid = true;
            switch (true) {
                case validationMessages.name!.length > 0:
                    isValid = false;
                    break;
                case validationMessages.email!.length > 0:
                    isValid = false;
                    break;
                case validationMessages.password!.length > 0:
                    isValid = false;
                    break;
                case validationMessages.roles !== '':
                    isValid = false;
                    break;
            }
            setIsValid(isValid);
        }, 
        [validationMessages]
    );



    const cancelHandler = useCallback(
        function cancelHandler() {
            onClose();
            dispatch(usersActions.clearEditValidationMessages());
        }   ,
        [onClose, dispatch]
    );
 
        
    function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dispatch(editUser(user));
    }


    function formatDate(date: string) {
        return date.substring(0, 10)
    }

    
    return (
        <Modal onBackdropClick={cancelHandler}>
            <Card>
                <div className='edit-user-modal'>

                    <div className='edit-user-modal__title mb-2'>Editing: {user._id}</div>
                    <div className='mb-2'>{user.isActivated ? 'Activated' : 'Not activated'}</div>
                    <div className='mb-2'>Created: {formatDate(user.createdAt)}</div>
                    <div className='mb-2'>Edited: {formatDate(user.updatedAt)}</div>

                    <form className='edit-form' onSubmit={submitHandler}>
                        <div className="mb-3">
                            <Input 
                                name='edit-name'
                                label='Name' 
                                onChange={changeName} 
                                value={user.name}
                                messages={validationMessages.name}
                            />
                        </div>
                        <div className="mb-3">
                            <Input 
                                name='edit-email'
                                type='email' 
                                label='Email' 
                                onChange={changeEmail} 
                                value={user.email}
                                messages={validationMessages.email}
                            />
                        </div>
                        <div className="mb-3">
                            <Input 
                                name='edit-password'
                                type='password' 
                                label='Password' 
                                onChange={changePassword} 
                                value=''
                                messages={validationMessages.password}
                            />
                        </div>
                        <div className='edit-roles'>
                        <div className='d-flex flex-column'>
                            <div>Roles</div>
                            <div className='d-flex mb-1'>
                                {
                                    roles.map((item) => {
                                        return <CheckboxRadio 
                                            key={item._id} 
                                            type='checkbox' 
                                            name={`edit-roles ${item._id}`} 
                                            label={item.value} 
                                            className='me-2'
                                            value={item.value}
                                            onChange={changeRoles}
                                            checked={user.roles.includes(item.value) ? true : false}
                                        />
                                    })
                                }
                            </div>
                            {
                                validationMessages.roles ? 
                                    <div className='text-danger validation-message'>{validationMessages.roles}</div> : 
                                    ''
                            }
                        </div>
                        </div>
                        {
                            isLoading ? 
                            <div className="d-flex justify-content-center align-items-center"> <Spinner/> </div>: 
                            <div className="d-flex justify-content-evenly">
                                <Button type='submit' className='btn-success' isDisabled={!isValid}>Save</Button>
                                <Button className='btn-danger' onClick={cancelHandler}>Cancel</Button>
                            </div>
                        }
                    </form>
                </div>
            </Card>
        </Modal>
    )
}

export default memo(EditUserModal);