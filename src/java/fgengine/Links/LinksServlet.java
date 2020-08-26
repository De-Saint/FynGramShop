/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fgengine.Links;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author mac
 */
public class LinksServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession(true);
            String type = request.getParameter("type");
            switch (type) {
                case "Track": {
                    response.sendRedirect("pages/shop/track/track.jsp");
                    break;
                }
                case "Products": {
                    response.sendRedirect("pages/shop/products/products.jsp");
                    break;
                }
                case "ProductDetails": {
                    response.sendRedirect("pages/shop/product_details/product_details.jsp");
                    break;
                }
                case "About": {
                    response.sendRedirect("pages/shop/aboutus/aboutus.jsp");
                    break;
                }
                case "Privacy": {
                    response.sendRedirect("pages/shop/privacy/privacy.jsp");
                    break;
                }
                case "Terms": {
                    response.sendRedirect("pages/shop/terms/terms.jsp");
                    break;
                }
                case "Contact": {
                    response.sendRedirect("pages/shop/contact/contact.jsp");
                    break;
                }
                case "Services": {
                    response.sendRedirect("pages/shop/services/services.jsp");
                    break;
                }
                case "Categories": {
                    response.sendRedirect("pages/shop/category/category.jsp");
                    break;
                }
                case "Complaints": {
                    response.sendRedirect("pages/shop/complaint/complaint.jsp");
                    break;
                }
                case "Sell": {
                    response.sendRedirect("pages/shop/sell/sell.jsp");
                    break;
                }
                case "Supports": {
                    response.sendRedirect("pages/shop/support/support.jsp");
                    break;
                }
                case "Cart": {
                    response.sendRedirect("pages/shop/cart/cart.jsp");
                    break;
                }
                case "CheckOut": {
                    response.sendRedirect("pages/shop/checkout/checkout.jsp");
                    break;
                }
                 case "OrderConfirmation": {
                    response.sendRedirect("pages/shop/order_confirm/order_confirm.jsp");
                    break;
                }
                case "FAQs": {
                    response.sendRedirect("pages/shop/faq/faq.jsp");
                    break;
                }
                case "Suggestions": {
                    response.sendRedirect("pages/shop/suggestions/suggestions.jsp");
                    break;
                }
                case "ReturnPolicy": {
                    response.sendRedirect("pages/shop/returned_policy/returned_policy.jsp");
                    break;
                }
                case "Search": {
//                    session.setAttribute("categoryID", request.getParameter("cat"));
//                    session.setAttribute("query", request.getParameter("query"));
                    response.sendRedirect("pages/products/products.jsp");
                    break;
                }
                case "Login": {
                    response.sendRedirect("pages/user/general/login/login.jsp");
                    break;
                }
                case "Register": {
                    response.sendRedirect("pages/user/general/register/register.jsp");
                    break;
                }
                case "Recovery": {
                    response.sendRedirect("pages/user/general/recovery/recovery.jsp");
                    break;
                }
                case "DashBoard": {
                    response.sendRedirect("pages/user/customer/dashboard/dashboard.jsp");
                    break;
                }
                case "Messages": {
                    response.sendRedirect("pages/user/customer/messages/messages.jsp");
                    break;
                }
                case "Profile": {
                    response.sendRedirect("pages/user/customer/profile/profile.jsp");
                    break;
                }
                case "Address": {
                    response.sendRedirect("pages/user/customer/address/address.jsp");
                    break;
                }
                case "CashOut": {
                    response.sendRedirect("pages/user/customer/cashout/cashout.jsp");
                    break;
                }
                case "Order": {
                    response.sendRedirect("pages/user/customer/order/order.jsp");
                    break;
                }
                case "OrderDetails": {
                    response.sendRedirect("pages/user/customer/order/orderdetails.jsp");
                    break;
                }
                case "WishList": {
                    response.sendRedirect("pages/user/customer/wishlist/wishlist.jsp");
                    break;
                }
                case "Reviews": {
                    response.sendRedirect("pages/user/customer/reviews/reviews.jsp");
                    break;
                }
                case "Transaction": {
                    response.sendRedirect("pages/user/customer/transaction/transaction.jsp");
                    break;
                }
                case "Wallets": {
                    response.sendRedirect("pages/user/customer/wallet/wallet.jsp");
                    break;
                }
                case "Payments": {
                    response.sendRedirect("pages/user/customer/payment/payment.jsp");
                    break;
                }
                case "Returns": {
                    response.sendRedirect("pages/user/customer/returns/returns.jsp");
                    break;
                }
                case "Discount": {
                    response.sendRedirect("pages/user/customer/discount/discount.jsp");
                    break;
                }

                case "LogOut": {
                    response.sendRedirect("index.jsp");
                    break;
                }
                case "Index": {
                    response.sendRedirect("index.jsp");
                    break;
                }
                default: {
                    response.sendRedirect(request.getHeader("referer"));
                }
            }
        }
    }
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException | SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException | SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
