import api from './Axios'


const fetchUserProfile = async()=>{
    try{
        console.log('call fetchUserProfile api..')
        const response = await api.get('/v1/user/profile')
        const user = response.data.data
        localStorage.setItem("user",JSON.stringify(user))
        return user
        
    }
    catch(error){
        console.log('failed to fetchUserProfile')
        localStorage.removeItem("user");
        return null
    }
}


export {fetchUserProfile}