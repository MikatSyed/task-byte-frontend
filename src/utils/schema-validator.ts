
export const getErrorMessageByPropertyName = (obj: Record<string,any>,name:string)=>{
    const properties = name.split(".")
    let value = obj;

    for( let prop of properties){
  
        if(value[prop]){
            value = value[prop]
        }else {
            return undefined;
        }
    }
    return value.message
}