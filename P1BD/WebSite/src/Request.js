/* eslint-disable no-unused-vars */


export async function GETmodule(request,updateFunction){
    let response;
    
    fetch(`http://localhost:8000/api/${request}`).then(res=>res.json()).then(data=>{response = data;
        updateFunction(response);
    }).catch(error => {
        console.error('Error:', error);
      });
      
}


export async function GETSpesificmodule(request,updateFunction){
    let response;
    
    fetch(`http://localhost:8000/api/${request}`).then(res=>res.json()).then(data=>{response = data;
        updateFunction(response);
    }).catch(error => {
        console.error('Error:', error);
      });
      
}

export async function GETFilters(request,filters,updateFunction){
   // filters = ['Tail','Vic'];


    let response;
    const Queryparams = {
        toFilter: filters.join('&toFilter=')
      };
    fetch(`http://localhost:8000/api/${request}?toFilter=${filters.join('&toFilter=')}`).then(res=>res.json()).then(data=>{response = data;
        updateFunction(response);
    }).catch(error => {
        console.error('Error:', error);
      });


}


