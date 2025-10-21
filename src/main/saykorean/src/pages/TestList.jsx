import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TestList( props ){

    const navigate = useNavigate();

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [studies,setStudies] = useState([]);

    function getTestFromStudies(){
        try{
            const studies = localStorage.
        }
    }
}