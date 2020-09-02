<%-- 
    Document   : register
    Created on : Jun 15, 2020, 7:54:45 PM
    Author     : Pinky
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html class="no-js" lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>FynGram Shop - Register</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Favicon -->
        <link rel="shortcut icon" type="image/x-icon" href="../../../../assets/img/favicon.ico">

        <!-- CSS 
        ========================= -->
        <!--bootstrap min css-->
        <link rel="stylesheet" href="../../../../assets/css/bootstrap.min.css">
        <!--owl carousel min css-->
        <link rel="stylesheet" href="../../../../assets/css/owl.carousel.min.css">
        <!--slick min css-->
        <link rel="stylesheet" href="../../../../assets/css/slick.css">
        <!--magnific popup min css-->
        <link rel="stylesheet" href="../../../../assets/css/magnific-popup.css">
        <!--font awesome css-->
        <link rel="stylesheet" href="../../../../assets/css/font.awesome.css">
        <!--ionicons css-->
        <link rel="stylesheet" href="../../../../assets/css/ionicons.min.css">
        <!--linearicons css-->
        <link rel="stylesheet" href="../../../../assets/css/linearicons.css">
        <!--animate css-->
        <link rel="stylesheet" href="../../../../assets/css/animate.css">
        <!--jquery ui min css-->
        <link rel="stylesheet" href="../../../../assets/css/jquery-ui.min.css">
        <!--slinky menu css-->
        <link rel="stylesheet" href="../../../../assets/css/slinky.menu.css">
        <!--plugins css-->
        <link rel="stylesheet" href="../../../../assets/css/plugins.css">

        <!-- Main Style CSS -->
        <link rel="stylesheet" href="../../../../assets/css/style.css">
        <!--Select 2-->
        <link rel="stylesheet" href="../../../../assets/css/select2.min.css" >

        <!--modernizr min js here-->
        <link href="../../../../assets/css/noty.css" rel="stylesheet"/>
        <link href="../../../../assets/css/noty_bootstrap-v4.css" rel="stylesheet" type="text/css"/>
        <script src="../../../../assets/js/vendor/modernizr-3.7.1.min.js"></script>

    </head>

    <body>

        <!--header area start-->

        <!--offcanvas menu area start-->
        <div class="off_canvars_overlay">

        </div>
        <%@include file="../../../../WEB-INF/jspf/shop/general/header/header.jspf" %>

        <jsp:include page="../../../../WEB-INF/static_pages/user/general/register/register.jsp"></jsp:include>

            <!--footer area start-->
        <%@include file="../../../../WEB-INF/jspf/shop/general/footer/footer.jspf" %>

        <!-- modal area end-->


        <!-- JS
        ============================================ -->
        <!--jquery min js-->
        <script src="../../../../assets/js/vendor/jquery-3.4.1.min.js"></script>
        <!--popper min js-->
        <script src="../../../../assets/js/popper.js"></script>
        <!--bootstrap min js-->
        <script src="../../../../assets/js/bootstrap.min.js"></script>
        <!--owl carousel min js-->
        <script src="../../../../assets/js/owl.carousel.min.js"></script>
        <!--slick min js-->
        <script src="../../../../assets/js/slick.min.js"></script>
        <!--magnific popup min js-->
        <script src="../../../../assets/js/jquery.magnific-popup.min.js"></script>
        <!--counterup min js-->
        <script src="../../../../assets/js/jquery.counterup.min.js"></script>
        <!--jquery countdown min js-->
        <script src="../../../../assets/js/jquery.countdown.js"></script>
        <!--jquery ui min js-->
        <script src="../../../../assets/js/jquery.ui.js"></script>
        <!--jquery elevatezoom min js-->
        <script src="../../../../assets/js/jquery.elevatezoom.js"></script>
        <!--isotope packaged min js-->
        <script src="../../../../assets/js/isotope.pkgd.min.js"></script>
        <!--slinky menu js-->
        <script src="../../../../assets/js/slinky.menu.js"></script>
        <!-- Plugins JS -->
        <script src="../../../../assets/js/plugins.js"></script>

        <!-- Main JS -->
        <script src="../../../../assets/js/main.js"></script>
        <script src="../../../../assets/js/helper.js"></script>
        <script src="../../../../assets/js/appscript.js"></script>
        <script src="register.js" type="text/javascript"></script>
        <script src="../../../../assets/js/noty.min.js" type="text/javascript"></script>



    </body>

</html>
