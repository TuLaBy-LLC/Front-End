import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectAuthComp({ children }) {

    return localStorage.getItem("token") ?
        <Navigate to="/" /> : children;

}
