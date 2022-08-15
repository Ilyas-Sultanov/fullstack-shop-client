import './Users.scss';
import { useEffect, useCallback, useMemo } from "react";
import { useSearchParams, URLSearchParamsInit } from 'react-router-dom';
import debounce from '../../../helpers/debounce';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import DatePicker, { DatePickerSelectedDates } from '../../../components/DatePicker/DatePicker';
import SelectWithSearch, {ISelectOption} from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import Spinner from '../../../components/UI/Spninner/Spinner';
import EditUserModal from './EditUserModal/EditUserModal';
import Pagination from '../../../components/UI/Pagination/Pagination';
import { ReactComponent as ChevronIcon } from '../../../img/chevron-down.svg';
import { ReactComponent as DeleteIcon } from '../../../img/trash.svg';
import { ReactComponent as EditIcon } from '../../../img/pencil-square.svg';
import { useDispatch, useSelector } from "react-redux";
import { getManyUsers, getOneUser, deleteOneUser } from "../../../store/reducers/users/usersActionCreators";
import { getRoles } from '../../../store/reducers/roles/rolesActionCreators';
import { usersActions } from '../../../store/reducers/users/users';
import { notificationActions } from '../../../store/reducers/notifications';
import { RootState } from "../../../store/store";
import IUser from "../../../types/IUser";
import formatDate from '../../../helpers/formatDate';

function Users() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const roles = useSelector((state: RootState) => state.roles);
    const {
        usersData, 
        activeUserId, 
        editingUser, 
        error, 
        isShowEditUserModal, 
        usersIsLoading, 
        isRedownloadUsers,
        editUserValidationMessages,
        isActivatedOptions
    } = useSelector((state: RootState) => state.users);  
    
    const columns = [
        {name: '_id', label: 'Id'},
        {name: 'name', label: 'Name'},
        {name: 'email', label: 'Email'},
        {name: 'role', label: 'Role'},
        {name: 'isActivated', label: 'Is Activated'},
        {name: 'createdAt', label: 'Created At'},
        {name: 'actions', label: 'Actions'},
    ];
    const dataFields = usersData.data.length > 0 ? (Object.keys(usersData.data[0]) as (keyof IUser)[]) : null;

    const fetchUsers = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
        // eslint ругается на то что у функции, которую возвращает debounce, не определяются зависимости
        debounce(
            function() {
                dispatch(getManyUsers(searchParams));
            },
            300
        ), 
        [searchParams]
    );

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); 

    if (isRedownloadUsers) {
        fetchUsers();
    }

    if (error) {
        dispatch(notificationActions.add({type: 'error', message: error}));
    }

  
    const searchById = useCallback(
        function(value: string) {
            const query = Object.fromEntries([...searchParams]); // преобразуем query параметры в объект
            query.page = '1'; // при изменениях в фильтре, всегда меняем страницу на первую
            if (value) query._id = value;
            else delete query._id;
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );


    const searchByName = useCallback(
        function(value: string) {
            const query = Object.fromEntries([...searchParams]);
            query.page = '1';
            if (value) query.name = value;
            else delete query.name;
            setSearchParams(query);
        }, 
        [searchParams, setSearchParams]
    );
    

    const searchByEmail = useCallback(
        function(value: string) {
            const query = Object.fromEntries([...searchParams]);
            query.page = '1';
            if (value) query.email = value;
            else delete query.email;
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );


    const searchByIsActive = useCallback(
        function(selectedOption?: ISelectOption) {
            const query = Object.fromEntries([...searchParams]);
            query.page = '1';
            if (selectedOption) {
                query.isActivated = selectedOption.value.toString();
            }
            else {
                delete query.isActivated;
            }
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );
    
    
    const searchByDate = useCallback((dates: [Date | null] | [Date | null, Date | null]) => {
        const query = Object.fromEntries([...searchParams]);
        delete query.dateFrom;
        delete query.dateTo;
        query.page = '1';
       
        if (dates[0]) {
            const year = dates[0].getFullYear();
            const month = dates[0].getMonth() < 10 ? `0${dates[0].getMonth()+1}` : dates[0].getMonth()+1;
            const day = dates[0].getDate() < 10 ? `0${dates[0].getDate()}` : dates[0].getDate();
            query.dateFrom = `${year}-${month}-${day}`;
        }
        if (dates[1]) {
            const year = dates[1].getFullYear();
            const month = dates[1].getMonth() < 10 ? `0${dates[1].getMonth()+1}` : dates[1].getMonth()+1;
            const day = dates[1].getDate() < 10 ? `0${dates[1].getDate()}` : dates[1].getDate();
            query.dateTo = `${year}-${month}-${day}`;
        }
        
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const searchByRole = useCallback((selectedRole?: ISelectOption) => {
        const query = Object.fromEntries([...searchParams]);
        query.page = '1';
        if (selectedRole) query.role = String(selectedRole.value);
        else delete query.role;
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const selectedRole = useMemo(() => {
        const role = roles.roles.find((role) => role.value === searchParams.get('role'));
        if (role) return role;
    }, [searchParams, roles.roles]);


    const selectedIsActiveOption = useMemo(() => {
        const option = isActivatedOptions.find((option) => option.value === searchParams.get('isActivated'));
        if (option) return option;
    }, [searchParams, isActivatedOptions]);

   
    const selectedDates = useMemo(() => {
        const from = searchParams.get('dateFrom');
        const to = searchParams.get('dateTo');
        
        const dates: DatePickerSelectedDates = [null, null];
        if (from) {
            const [year, month, day] = from.split('-');
            dates[0] = new Date(+year, +month-1, +day);
        }
        if (to) {
            const [year, month, day] = to.split('-');
            dates[1] = new Date(+year, +month-1, +day);
        }
        return dates;
    }, [searchParams]);

   
    const changePerPage = useCallback((pageLimit: number) => {
        const query = Object.fromEntries([...searchParams]);
        query.limit = String(pageLimit);
        setSearchParams(query);
    }, [searchParams, setSearchParams]);
    

    const changePage = useCallback((pageNumber: number) => {
        const query = Object.fromEntries([...searchParams]);
        query.page = String(pageNumber);
        setSearchParams(query);
    }, [searchParams, setSearchParams]);


    const sortHandler = useCallback(
        function(columnName: string) {
            if (columnName !== 'actions') {
                const query = Object.fromEntries([...searchParams]);
                if (query.sort === columnName && query.order === '1') query.order = '-1';
                else if (query.sort === columnName && query.order === '-1') query.order = '1';
                else {
                    query.sort = columnName; 
                    query.order = '1';
                }
                setSearchParams(query);
            }
        },
        [searchParams, setSearchParams]
    );
    

    const clearAllFilters = useCallback(
        function() {
            const query: URLSearchParamsInit = {page: '1'};
            const limit = searchParams.get('limit');
            if (limit) query.limit = limit;
            setSearchParams(query);
        },
        [searchParams, setSearchParams]
    );
    

    const hideEditUserModal = useCallback(
        function () {
            dispatch(usersActions.setIsShowEditUserModal(false));
            dispatch(usersActions.setEditingUser(null));
        },
        [dispatch]
    );
    

    function editBtnHandler(_id: string) {
        dispatch(usersActions.setActiveUserId(_id));
        dispatch(getOneUser(_id));
    }

    function deleteUser(_id: string) {
        dispatch(usersActions.setActiveUserId(_id));
        dispatch(deleteOneUser(_id));
    }


    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-between users-container">
            {
                <div className="table-responsive h-100 mb-2">
                    <table className="table table-sm table-striped table-bordered users-table">
                        <thead>
                            <tr>
                                { 
                                    columns.map((column) => {
                                        return (
                                            <th key={ column.name } onClick={() => sortHandler(column.name)}>
                                                <span className="me-2">{ column.label }</span>
                                                {
                                                    (searchParams.get('sort') === column.name && searchParams.get('order') === '1') ? 
                                                    <ChevronIcon className='chevronIcon--ascending'/> :
                                                    (searchParams.get('sort') === column.name && searchParams.get('order') === '-1') ?
                                                    <ChevronIcon className='chevronIcon--descending'/> :
                                                    ''
                                                }
                                            </th>
                                        )
                                    }) 
                                }
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        name="_id" 
                                        type="search" 
                                        value={searchParams.get("_id") || ""}
                                        onChange={(e) => searchById(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Input
                                        name="name" 
                                        type="search"
                                        value={searchParams.get("name") || ""}
                                        onChange={(e) => searchByName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Input
                                        name="email" 
                                        type="search"
                                        value={searchParams.get("email") || ""}
                                        onChange={(e) => searchByEmail(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <SelectWithSearch 
                                        idKey='_id'
                                        labelKey='value'
                                        title=''
                                        placeholder='All'
                                        onChange={searchByRole}
                                        options={roles.roles}
                                        selectedOption={selectedRole}
                                    />
                                </td>
                                <td>
                                    <SelectWithSearch 
                                        idKey='value'
                                        labelKey='label'
                                        title=''
                                        placeholder='All'
                                        onChange={searchByIsActive}
                                        options={isActivatedOptions}
                                        selectedOption={selectedIsActiveOption}
                                    />
                                </td>
                                <td>
                                    <DatePicker 
                                        selectedDates={selectedDates}
                                        onChange={searchByDate}
                                    />
                                </td>
                                <td key='filter-btn' className='filter-btn'> 
                                    <Button className='btn-secondary btn-sm text-nowrap' onClick={clearAllFilters}> Clear Filters </Button> 
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usersData.data.length > 0 ?
                                usersData.data.map((item) => {
                                    return (
                                        <tr key={item._id}>
                                            {
                                                dataFields!.map((field) => {
                                                    if (field === 'roles') return <td key={ field }>{ (item[field] as string[]).join(', ') }</td> 
                                                    if (field === 'isActivated') return <td key={ field }>{ (item[field] as boolean).toString() }</td> 
                                                    if (field === 'createdAt') return <td key={ field }>{ formatDate(item[field]) }</td> 
                                                    return <td key={ field }>{ item[field] }</td>  
                                                })
                                            }
                                            <td key='filter-buttons' className='action-buttons'> 
                                                {
                                                    activeUserId === item._id ? 
                                                    <Spinner style={{width: '30px', height:"30px"}}/> : 
                                                    <>
                                                        <Button className="btn-warning btn-sm d-flex justify-content-senter align-items-center" onClick={() => editBtnHandler(item._id)}><EditIcon/></Button>
                                                        <Button className="btn-danger btn-sm d-flex justify-content-senter align-items-center" onClick={() => deleteUser(item._id)}><DeleteIcon/></Button>
                                                    </>
                                                }
                                                
                                            </td>
                                        </tr>
                                    )
                                }) :
                                <tr><td>Users not found</td></tr>
                            }
                        </tbody>
                    </table>
                </div> 
            }

            {
                usersData.data.length > 0 ?
                <Pagination 
                    limit={usersData.limit} 
                    currentPage={usersData.currentPage}
                    totalDocuments={usersData.totalNumberOfMatches}
                    siblingsCount={4}
                    onChangePage={changePage}
                    onChangePerPage={changePerPage}
                /> : 
                ''
            }               	

            { 
                isShowEditUserModal ? 
                <EditUserModal 
                    user={editingUser} 
                    validationMessages={editUserValidationMessages} 
                    isLoading={usersIsLoading} 
                    onClose={hideEditUserModal} 
                    roles={roles.roles}
                /> :
                '' 
            }
        </div>
    )
}

export default Users;