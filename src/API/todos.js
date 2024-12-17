import axiosClient from './axiosClient'

const END_POINT ={
    TODOS:'F98'
}

export const getTodosAPI = () =>{
    return axiosClient.get(`${END_POINT.TODOS}`);
}