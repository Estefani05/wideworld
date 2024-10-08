Exec getAllCustomers

Exec getAllSupliers 

Exec getAllStock

Exec getAllSales




Exec getOneCustomer @name = 'Tailspin Toys (Airport Drive, MO)';

Exec getOneSuplier @name = 'Lucerne Publishing';

Exec getOneStock @name = 'Furry animal socks (Pink) M';

Exec getOneSale @id = '3';

Exec getFilteredCustomers @SQLfilters = '( CustomerName like ''%Ve%'' and CustomerName like ''%tail%''  )';


EXEC getFilteredSupliers @SQLfilters = '( PSC.SupplierCategoryName like ''%No%'' and PSC.SupplierCategoryName like ''%Toy%''  )', @SQLfilters2 =  '( PSC.SupplierCategoryName like ''%No%'' and PSC.SupplierCategoryName like ''%Toy%''  )';

EXEC getFilteredStock @SQLfilters = '( WSG.StockGroupName like ''%XL%'' and WSG.StockGroupName like ''%Clo%''  )', @SQLfilters2 =   '( WSG.StockGroupName like ''%XL%'' and WSG.StockGroupName like ''%Clo%''  )';

EXEC getFilteredSales @SQLfilters = '( SC.CustomerName like ''%Kam%'' )';