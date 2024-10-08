CREATE PROCEDURE getAllCustomers
AS
Select CustomerName, CustomerCategoryName,
        DeliveryMethodName
        from Sales.Customers
        join Sales.CustomerCategories on 
        Sales.Customers.CustomerCategoryID = 
        Sales.CustomerCategories.CustomerCategoryID
        join Application.DeliveryMethods on 
        Application.DeliveryMethods.DeliveryMethodID = 
        Sales.Customers.DeliveryMethodID Where BuyingGroupID IS NOT NULL 
        order by CustomerName
GO

CREATE PROCEDURE getAllSupliers 
AS


Select PS.SupplierName, PSC.SupplierCategoryName,AD.DeliveryMethodName
    from Purchasing.Suppliers PS
    join Purchasing.SupplierCategories PSC on PS.SupplierCategoryID = PSC.SupplierCategoryID
    join Application.DeliveryMethods AD on PS.DeliveryMethodID = AD.DeliveryMethodID
    Where PS.SupplierCategoryID IS NOT NULL and PS.DeliveryMethodID IS NOT NULL order by
    SupplierName

GO

CREATE PROCEDURE getAllStock
AS

select  WS.StockItemName, STRING_AGG(WSG.StockGroupName ,' , ') as ItemGroups , WSH.QuantityOnHand

                                                    from Warehouse.StockItemStockGroups WSR  
                                                    join Warehouse.StockItems WS on WSR.StockItemID = WS.StockItemID
                                                    join Warehouse.StockGroups WSG on WSR.StockGroupID = WSG.StockGroupID
                                                    join Warehouse.StockItemHoldings WSH on WSR.StockItemID = WSH.StockItemID 
                                                    group by WS.StockItemName,WSH.QuantityOnHand order by LEFT(REPLACE(WS.StockItemName,'"',''),1)

GO


CREATE PROCEDURE getAllSales
AS
SELECT TOP 500 SIL.InvoiceLineID,SI.InvoiceDate,SC.CustomerName,AD.DeliveryMethodName,
        SIL.ExtendedPrice

        from Sales.InvoiceLines  SIL

        join Sales.Invoices SI on SI.InvoiceID = SIL.InvoiceID
        join Sales.Customers SC on SI.CustomerID = SC.CustomerID
        join Application.DeliveryMethods AD on SI.DeliveryMethodID = AD.DeliveryMethodID
        Order by SIL.InvoiceLineID

GO


CREATE PROCEDURE getOneCustomer @name nvarchar(70)
AS
Select SC.CustomerName, CustomerCategoryName,
        DeliveryMethodName, BuyingGroupName,AP.PreferredName as Contact,APT.PreferredName as AlterContact, SCT.CustomerName as ClienteAFacturar,
        SC.PostalPostalCode, SC.PhoneNumber, SC.FaxNumber,SC.PaymentDays,SC.WebsiteURL,SC.DeliveryAddressLine1
        from Sales.Customers SC
        join Sales.CustomerCategories SCC on SC.CustomerCategoryID = SCC.CustomerCategoryID
        join Application.DeliveryMethods AD on AD.DeliveryMethodID = SC.DeliveryMethodID 
        join Sales.BuyingGroups  SB on SB.BuyingGroupID = SC.BuyingGroupID
        join Application.People AP on AP.PersonID = SC.PrimaryContactPersonID 
        join Application.People APT on  APT.PersonID = SC.AlternateContactPersonID
        join Sales.Customers SCT on SC.BillToCustomerID = SCT.CustomerID
        join Application.Cities AC on SC.DeliveryCityID = AC.CityID 
        Where SC.CustomerName like @name
        order by CustomerName

GO



CREATE PROCEDURE getOneSuplier @name nvarchar(70)
AS
Select PS.SupplierReference,PS.SupplierName,PSC.SupplierCategoryName,AP.PreferredName as Contact,APT.PreferredName as AlterContact,
    AC.CityName, PS.PhoneNumber, PS.FaxNumber, PS.WebsiteURL,CONCAT(PS.DeliveryAddressLine1, ' ', PS.DeliveryAddressLine2) as DeliveryAddress,
    CONCAT(PS.PostalAddressLine1,' ',PS.PostalAddressLine2) as Postal,PS.BankAccountName,PS.BankAccountNumber,PS.PaymentDays

    from Purchasing.Suppliers PS
    join Purchasing.SupplierCategories PSC on PS.SupplierCategoryID = PSC.SupplierCategoryID
    join Application.People AP on AP.PersonID = PS.PrimaryContactPersonID 
    join Application.People APT on  APT.PersonID = PS.AlternateContactPersonID
    join Application.DeliveryMethods AD on AD.DeliveryMethodID = PS.DeliveryMethodID 
    join Application.Cities AC on   AC.CityID = PS.DeliveryCityID
    Where PS.SupplierName like @name
    Order by PS.SupplierName;

	GO


CREATE PROCEDURE getOneStock @name nvarchar(70)
AS
Select WS.StockItemName,PS.SupplierName,WC.ColorName,WP.PackageTypeName as UnitPackage,
        WPT.PackageTypeName as OuterPackage,WS.QuantityPerOuter,WS.Brand,WS.Size,
        WS.TaxRate, WS.UnitPrice

        from Warehouse.StockItems WS  
        join Warehouse.Colors WC on WS.ColorID = WC.ColorID
        join Purchasing.Suppliers PS on PS.SupplierID = WS.SupplierID
        join Warehouse.PackageTypes WP on WS.UnitPackageID = WP.PackageTypeID
        join Warehouse.PackageTypes WPT on WS.OuterPackageID = WPT.PackageTypeID
        Where WS.StockItemName like @name

        order by LEFT(REPLACE(WS.StockItemName,'"',''),1)
GO

CREATE PROCEDURE getOneSale @id nvarchar(70)
AS
select  SIL.InvoiceLineID,SC.CustomerName,AD.DeliveryMethodName,SO.CustomerPurchaseOrderNumber,
            AP.PreferredName as CopntactPerson,
            APT.FullName as SellerName, SI.InvoiceDate,SI.DeliveryInstructions,WS.StockItemName,SIL.Quantity,WS.UnitPrice,
            SIL.TaxRate,SIL.TaxAmount,SIL.LineProfit


            from Sales.InvoiceLines  SIL 
            join Sales.Invoices SI on SI.InvoiceID = SIL.InvoiceID
            join Sales.Customers SC on SC.CustomerID = SI.CustomerID
            join Application.DeliveryMethods AD on SI.DeliveryMethodID = AD.DeliveryMethodID
            join Sales.Orders SO on SI.OrderID = SO.OrderID
            join Application.People AP on AP.PersonID =  SI.ContactPersonID 
            join Application.People APT on APT.PersonID =  SI.SalespersonPersonID
            join Warehouse.StockItems WS on SIL.StockItemID = WS.StockItemID
            Where SIL.InvoiceLineID = @id

			GO

CREATE PROCEDURE getFilteredCustomers @SQLfilters NVARCHAR(MAX)
AS

DECLARE @SQLQuery NVARCHAR(MAX)

SET @SQLQuery = 'Select CustomerName, CustomerCategoryName,
        DeliveryMethodName
        from Sales.Customers
        join Sales.CustomerCategories on 
        Sales.Customers.CustomerCategoryID = 
        Sales.CustomerCategories.CustomerCategoryID
        join Application.DeliveryMethods on 
        Application.DeliveryMethods.DeliveryMethodID = 
        Sales.Customers.DeliveryMethodID Where BuyingGroupID IS NOT NULL 
        and  ' + @SQLfilters +'
        order by 
        CustomerName;'
		EXEC sp_executesql @SQLQuery;

GO



CREATE PROCEDURE getFilteredSupliers @SQLfilters NVARCHAR(MAX), @SQLfilters2 NVARCHAR(MAX)
AS

DECLARE @SQLQuery NVARCHAR(MAX)

SET @SQLQuery = 'Select PS.SupplierName, PSC.SupplierCategoryName,AD.DeliveryMethodName
                from Purchasing.Suppliers PS
                join Purchasing.SupplierCategories PSC on PS.SupplierCategoryID = PSC.SupplierCategoryID
                join Application.DeliveryMethods AD on PS.DeliveryMethodID = AD.DeliveryMethodID
                Where PS.SupplierCategoryID IS NOT NULL and PS.DeliveryMethodID IS NOT NULL 
                and  ' + @SQLfilters +' or ' + @SQLfilters2 +
                '  order by
                SupplierName;'
		EXEC sp_executesql @SQLQuery;

GO



CREATE PROCEDURE getFilteredStock @SQLfilters NVARCHAR(MAX), @SQLfilters2 NVARCHAR(MAX)
AS

DECLARE @SQLQuery NVARCHAR(MAX)

SET @SQLQuery = 'select  WS.StockItemName, STRING_AGG(WSG.StockGroupName ,'' , '') as ItemGroups , WSH.QuantityOnHand

                                                    from Warehouse.StockItemStockGroups WSR  
                                                    join Warehouse.StockItems WS on WSR.StockItemID = WS.StockItemID
                                                    join Warehouse.StockGroups WSG on WSR.StockGroupID = WSG.StockGroupID
                                                    join Warehouse.StockItemHoldings WSH on WSR.StockItemID = WSH.StockItemID 
                                                    Where ' + @SQLfilters +' or ' + @SQLfilters2 +

                                                    '  group by WS.StockItemName,WSH.QuantityOnHand order by LEFT(REPLACE(WS.StockItemName,''"'',''''),1)'
		EXEC sp_executesql @SQLQuery;

GO


CREATE PROCEDURE getFilteredSales @SQLfilters NVARCHAR(MAX)
AS

DECLARE @SQLQuery NVARCHAR(MAX)

SET @SQLQuery = 'SELECT TOP 500 SIL.InvoiceLineID,SI.InvoiceDate,SC.CustomerName,AD.DeliveryMethodName,
            SIL.ExtendedPrice

            from Sales.InvoiceLines  SIL

            join Sales.Invoices SI on SI.InvoiceID = SIL.InvoiceID
            join Sales.Customers SC on SI.CustomerID = SC.CustomerID
            join Application.DeliveryMethods AD on SI.DeliveryMethodID = AD.DeliveryMethodID
            Where  '+ @SQLfilters +
            ' Order by SIL.InvoiceLineID '
		EXEC sp_executesql @SQLQuery;

GO






