<%-- 
    Document   : index
    Created on : Jun 16, 2020, 1:33:52 PM
    Author     : Pinky
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!--header area start-->
        <div class="off_canvars_overlay">

        </div>

    
        <%@include file="../../../WEB-INF/jspf/shop/general/header/header.jspf" %>


        <jsp:include page="../../../WEB-INF/static_pages/shop/index/index.jsp"></jsp:include>
     
        <%@include file="../../../WEB-INF/jspf/shop/general/footer/footer.jspf" %>
        <%@include file="../../../WEB-INF/jspf/shop/index/index_product_view.jspf" %>
        <%@include file="../../../WEB-INF/jspf/shop/index/added.jspf" %>

        <%--<%@include file="../../../WEB-INF/jspf/shop/index/newsletter_popup.jspf" %>--%>

