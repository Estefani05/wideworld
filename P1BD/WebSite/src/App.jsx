/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { GETmodule ,GETSpesificmodule,GETFilters} from './Request';
import './App.css'
import e from 'cors';

function App() {
  const [module, setModule] = useState("Modulo_Cliente")
  const [floating,setFloating] = useState(false)
  const [cardData,setCardData] = useState([])
  const [headers,setHeaders] = useState([])
  const [cardDataf,setCardDataf] = useState([])
  const [headersf,setHeadersf] = useState([])
  const [formData, setFormData] = useState({
    filterData: ''
  });
  const[filters,setFilters] = useState([''])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
     e.preventDefault();
    
    console.log('Form submitted: ', formData['filterData']);
    let newFilters = filters;
    newFilters.push(formData['filterData']);
    console.log(newFilters);
    setFilters(newFilters);
  
    GETFilters(`${module}_filtered`,filters,updateCardData)

    setFormData({
      filterData: ''
    });





  };

  useEffect(()=>{
    changeModule(module,null);
    console.log(filters)
    //setFilters([]);
  },[]);

/*
  useEffect(()=>{
    
  },[filters]);


*/
  function updateCardData(data){
    const Headers = Object.keys(data[0]);
    setHeaders(Headers);
    setCardData(data);
  }

  async function changeModule(value,event){
    setModule(value);
    GETmodule(value,updateCardData);
  }




function updateCardDataf(data){

  const Headers = Object.keys(data[0]);
  setHeadersf(Headers);
  setCardDataf(data);
  setFloating(true);


}
function close(){
  setFloating(false);

}
 async function showDetailData(param,event){ 
    //console.log(event.target.textContent);
    const newParam = `${module}/${param}`;
    GETSpesificmodule(newParam,updateCardDataf)
  
 };



 const Modules = ["Modulo_Cliente","Modulo_Proveedores","Modulo_Inventarios","Modulo_Ventas"];

  return (
          <>

            <div className="card">
                    <div className="card_title">WideWorld Importers</div>    
                    <div className = "filters-section">                    
                    <form onSubmit={handleSubmit}>
                          <label>
                            Filter: 
                            <input
                              type="text"
                              name="filterData"
                              value={formData.filterData}
                              onChange={handleChange}
                            />
                          </label>
                          <button type="submit">Submit</button>
                    </form>
                    <button onClick = {()=>setFilters([''])}>clear</button>
                    <ul className='filters-section'>
                        {filters.map((name,index) =><li className="item tag" key= {index+900}>{name}</li>)}
                    </ul>     


                    </div>
                    <div className = "card_wrapper"> 
                      <div className= "menu_var">
                        {Modules.map((name,index) =><button onClick = {(event)=>{changeModule(name,event)} }key= {index}>{name}</button>)}
                      </div>        
                      <div  className="card_data">

                        <ul  className="row row-head">
                        {headers.map((header,index) =><li className="item" key= {index+400} >{header}</li>)}
                        </ul>

                        {cardData.map((ObjectEntry,index)=>(
                          <ul key={Object.values(ObjectEntry)[0]} className="row" onClick = {(event) => showDetailData(Object.values(ObjectEntry)[0],event) }> {
                            
                            Object.entries(ObjectEntry).map(([key, value]) => (
                              <li className="item" key={key}>
                                {value}
                              </li>
                            ))} </ul>))}

                      </div>
                    </div>  
              </div>

              {floating? 
              <div className='floating-frame'>

                      <div className = "card_wrapper">                       
                  
                      <div  className="card_data">

                            <ul  className="row row-head">
                            {headersf.map((header,index) =><li className="item" key= {index+800} >{header}</li>)}
                            </ul>

                            {cardDataf.map((ObjectEntry,index)=>(
                              <ul key={Object.values(ObjectEntry)[0]} className="row"> {
                                
                                Object.entries(ObjectEntry).map(([key, value]) => (
                                  <li className="item" key={key}>
                                    {value}
                                  </li>
                                ))} </ul>))}

                        </div>
                        <button onClick={close}>X</button>
                      </div>


                </div>: <></>}
            </>
            
  )
}

export default App
