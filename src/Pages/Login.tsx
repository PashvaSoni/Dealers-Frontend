import React, { useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import { config } from '../Constant'
import { useDealersData } from '../Context/DealersContext';



export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { User, setUser } = useAuth();
    const {dealer,setDealer} = useDealersData();
    const [form] = Form.useForm();
    const [formData, setformData] = useState({ mobile: "", password: "" });

    const HandleSubmit = async () => {
        console.log(formData);
        try {
            const response = await axios.post(config.URLS.BACKEND_URL + 'account/signin', formData, { withCredentials: true });
            console.log(response.data);
            setUser({ ...User, userData: response.data.data.userinfo });
            const response2 = await axios.get(config.URLS.BACKEND_URL + 'accountmetadata/me',{withCredentials:true});
            setDealer({...dealer,DealersData:response2.data?.data});
            localStorage.setItem('dealersinfo',JSON.stringify(response2.data.data))
            localStorage.setItem('userinfo', JSON.stringify(response.data.data.userinfo));
            navigate(from, { replace: true });
        }
        catch (err) {
            console.error(err)
        }

    }

    return (
        <LoginContainer>
            <LoginFormContainer>
                <h2 style={{ textAlign: "center" }}>Login To Your Account !</h2>
                <Form
                    form={form}
                    name="Login_Form"
                    initialValues={{}}
                    autoComplete="off"
                    layout='vertical'
                >
                    <Form.Item
                        label="Phone Numnber"
                        name="mobile"
                        rules={[{ required: true, message: 'Please input your phonenumber!', len: 10 }]}
                    >
                        <Input placeholder='Enter Phonenumber ...' onChange={(e) => { setformData({ ...formData, mobile: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder='Enter Password ...' onChange={(e) => { setformData({ ...formData, password: e.target.value }) }} />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button onClick={HandleSubmit} type="primary">Login</Button>
                    </Form.Item>
                </Form>
            </LoginFormContainer>
        </LoginContainer>
    )
};

const LoginContainer = styled.div`
    width:100%;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:1rem;

`;

const LoginFormContainer = styled.div`
    background-color:${(prop) => prop.theme.color.color2};
    padding:0.5rem;
    align-items:center;    
    border-radius:15px;
    
    @media ${(prop) => prop.theme.device.mobile} { 
        width:100%;
    }
    @media ${(prop) => prop.theme.device.tablet} {
        width:60%; 
    }
    @media ${(prop) => prop.theme.device.laptop} { 
        width:50%; 
    }
`;