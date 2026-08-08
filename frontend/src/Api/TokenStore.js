
let AccessToken = null

const GetAccessToken = ()=>{
    return AccessToken
}

const SetAccessToken = (Token)=>{
    AccessToken = Token
}

const ClearAccessToken = ()=>{
    AccessToken = null
}




export {AccessToken,SetAccessToken,GetAccessToken,ClearAccessToken}