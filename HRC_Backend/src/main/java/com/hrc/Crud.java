package com.hrc;

import java.sql.Connection;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class Crud {
	
	static {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	
	private static Connection getConnection() {
		try {
			String url = "jdbc:mysql://localhost:3306/data1";
			String username = "root";
			String password = "bike";
			return DriverManager.getConnection(url, username, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
		
		
	}

	
	public static int create(Invoice invoice) {
		int rows_affected = 0;
		Connection con = null;
		
		// we have 3 tables ( business, customer and winter_internship );
		PreparedStatement businessSt = null, customerSt = null, mainSt = null; 

		try {
			con = getConnection();
			con.setAutoCommit(false);
			String q1 = "INSERT  INTO `business`(`business_code`,`business_name`) VALUES (?, ?)";
			String q2 = "INSERT  INTO `customer`(`cust_number`,`name_customer`) VALUES (?, ?)";
			String query = "INSERT  INTO `winter_internship`(`business_code`,`cust_number`,`clear_date`,`buisness_year`,"
					+ "`doc_id`,`posting_date`,`document_create_date`,`document_create_date1`,`due_in_date`,`invoice_currency`,"
					+ "`document_type`,`posting_id`,`area_business`,`total_open_amount`,`baseline_create_date`,`cust_payment_terms`,"
					+ "`invoice_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			businessSt = con.prepareStatement(q1);
			customerSt = con.prepareStatement(q2);
			mainSt = con.prepareStatement(query);
			
			businessSt.setString(1, invoice.getBusiness_code());
			businessSt.setString(2, invoice.getBusiness_name());
			customerSt.setInt(1, invoice.getCust_number());
			customerSt.setString(2, invoice.getName_customer());

			// We have foreign keys(cust_number, business code) in winter_internship table
			// so we'll first insert values inside 'business' and 'customer' table and
			// if value is already present we'll do nothing and continue inserting main data
			try {
				businessSt.executeUpdate();
			} catch (SQLException e) {
				// Do nothing
			}

			try {
				customerSt.executeUpdate();
			} catch (SQLException e) {
				// Do nothing
			}

			
			mainSt.setString(1, invoice.getBusiness_code());
			mainSt.setInt(2, invoice.getCust_number());
			mainSt.setString(3, invoice.getClear_date());
			mainSt.setString(4, invoice.getBuisness_year());
			mainSt.setString(5, invoice.getDoc_id());
			mainSt.setString(6, invoice.getPosting_date());
			mainSt.setString(7, invoice.getDocument_create_date());
			mainSt.setString(8, invoice.getDocument_create_date1());
			mainSt.setString(9, invoice.getDue_in_date());
			mainSt.setString(10, invoice.getInvoice_currency());
			mainSt.setString(11, invoice.getDocument_type());
			mainSt.setInt(12, invoice.getPosting_id());
			mainSt.setString(13, invoice.getArea_business());
			mainSt.setDouble(14, invoice.getTotal_open_amount());
			mainSt.setString(15, invoice.getBaseline_create_date());
			mainSt.setString(16, invoice.getCust_payment_terms());
			mainSt.setInt(17, invoice.getInvoice_id());
			
			rows_affected = mainSt.executeUpdate();
			con.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				con.close();
				businessSt.close();
				customerSt.close();
				mainSt.close();
				
			} catch (SQLException e) {
				System.out.println("failed to close sql objects... (create() Method)...");
				e.printStackTrace();
			}
		}
		return rows_affected;
	}
	
	public static ArrayList<Invoice> read(String query){
		ArrayList<Invoice> invoiceList = new ArrayList<>();
		Connection con = null;
		Statement mainSt = null, businessSt = null, customerSt = null;
		
		ResultSet result = null, bus_result = null, cust_result = null;
		try {
			con = getConnection();
			con.setAutoCommit(false);
			mainSt = con.createStatement();
			businessSt = con.createStatement();
			customerSt = con.createStatement();

			result = mainSt.executeQuery(query);

			while (result.next()) {

				// To get business name
				String bus_query = "Select `business_name` from business where business_code = '" + result.getString(2)
						+ "'";

				// To get customer name
				String cust_query = "Select `name_customer` from customer where cust_number = '" + result.getString(3)
						+ "'";

				bus_result = businessSt.executeQuery(bus_query);
				cust_result = customerSt.executeQuery(cust_query);

				bus_result.next();
				cust_result.next();

				String business_name = bus_result.getString(1);
				String name_customer = cust_result.getString(1);

				String year = Integer.toString(result.getDate(5).toLocalDate().getYear());
				String clear_date = result.getString(4);
				
				// clear_date is in format (YYYY-MM-DD)
				// so if first year starts with 0
				// we'll assign clear_date to null to get Blank column in webApp
				if(clear_date != null && clear_date.charAt(0) == '0') {
					clear_date = null;
				}
				String aging = result.getString(20);
				if(aging == null) aging = "N/A";

				invoiceList.add(new Invoice(result.getInt(1), result.getString(2), business_name, result.getInt(3),
						name_customer, clear_date, year, result.getString(6), result.getString(7), result.getString(8),
						result.getString(9), result.getString(10), result.getString(11), result.getString(12),
						result.getInt(13), result.getString(14), result.getDouble(15), result.getString(16),
						result.getString(17), result.getInt(18), result.getInt(19), aging,
						result.getInt(21)));
				

			}

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(con != null) con.close();
				if(mainSt != null) mainSt.close();
				if(businessSt != null) businessSt.close();
				if(customerSt != null) customerSt.close();
				if(result != null) result.close();
				if(bus_result != null) bus_result.close();
				if(cust_result != null) cust_result.close();
			} catch(SQLException e) {
				e.printStackTrace();
			}
		}

		return invoiceList;
	}
	
	public static int getCount(String query) {
		int count = 0;
		Connection con = null;
		Statement st = null;
		ResultSet rs = null;
		try {
			con = getConnection();
			st = con.createStatement();
			rs  = st.executeQuery(query);
			rs.next();
			count = rs.getInt(1);
		} catch(SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(con != null) con.close();
				if(st != null) st.close();
				if(rs != null) rs.close();
			} catch (SQLException e) {
				
			}
		}
		
		return count;
	}

	public static int delete(ArrayList<Integer> sl_noList) {
		int rows_affected = 0;
		Connection con = null;
		PreparedStatement st = null;
		try {
			con = getConnection();
			con.setAutoCommit(false);

			// using sl_no ( because each entry in the table has a unique sl_no )
			String query = "Delete from winter_internship where sl_no = ?";
			st = con.prepareStatement(query);
			
			for(int i = 0; i < sl_noList.size(); i++) {
				st.setInt(1, sl_noList.get(i));
				rows_affected += st.executeUpdate();
			}
			con.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				con.close();
				st.close();
			} catch (SQLException e) {
				System.out.println("failed to close sql objects... (deleteInvoice() Method)...");
				e.printStackTrace();
			}
		}

		return rows_affected;
	}
	
	
	public static int update (ArrayList<Invoice> invList) {
		int rows_affected = 0;
		Connection con = null;
		PreparedStatement st = null;
		try {
			con = getConnection();
			con.setAutoCommit(false);

			for(int i = 0; i < invList.size(); i++) {
				String aging = invList.get(i).getAging_bucket();
				
				// using sl_no ( because each entry in the table has a unique sl_no )
				String query = "update winter_internship set invoice_currency='"
								+ invList.get(i).getInvoice_currency() + "', aging_bucket='" 
								+ aging + "', cust_payment_terms='" + invList.get(i).getCust_payment_terms() 
								+ "' where sl_no = '" + invList.get(i).getSl_no() + "'";
				st = con.prepareStatement(query);
				rows_affected += st.executeUpdate();
				con.commit();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				con.close();
				st.close();
			} catch (SQLException e) {
				System.out.println("failed to close sql objects... (deleteInvoice() Method)...");
				e.printStackTrace();
			}
		}

		return rows_affected;

	}
	
	

	
}
