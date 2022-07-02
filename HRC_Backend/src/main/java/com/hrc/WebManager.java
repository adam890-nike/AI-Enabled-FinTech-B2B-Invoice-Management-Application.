package com.hrc;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


@WebServlet("/HRC_Manager")
public class WebManager extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static void fetchData(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		int page = Integer.parseInt(req.getParameter("page"));
		int rowsPerPage = Integer.parseInt(req.getParameter("rowsperpage"));
		
		String sortCol = req.getParameter("sort");
		String sortOrder = req.getParameter("order");
		if(sortCol == null) {
			sortCol = "sl_no";
		}
		
		if(sortOrder == null) {
			sortOrder = "asc";
		}
		
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		int start = page*rowsPerPage;
				
		String customQuery = "from winter_internship";
		
		
			
			String cust_num = req.getParameter("cust_number");
			String bus_year = req.getParameter("buisness_year");
			String doc_id = req.getParameter("doc_id");
			String invoiceId = req.getParameter("invoice_id");
			
			if(cust_num != null) {
				customQuery += " where ";
				customQuery += " cust_number regexp '^" + cust_num + "'";
			}
			if(bus_year != null) {
				if(cust_num != null) customQuery += " and ";
				else customQuery += " where ";
				customQuery += "buisness_year='" + bus_year + "'";
			}
			if(doc_id != null) {
				if(cust_num != null || bus_year != null) customQuery += " and ";
				else customQuery += " where ";
				customQuery += " doc_id='" + doc_id + "'";
			}
			if(invoiceId != null) {
				if(cust_num != null || bus_year != null || doc_id != null) customQuery += " and ";
				else customQuery += " where ";
				customQuery += " invoice_id='" + invoiceId + "'";
			}
			
		
		
		customQuery += " order by " + sortCol + " " + sortOrder;
		int totalRows = Crud.getCount("Select count(*) " + customQuery);
		
		customQuery += " limit " + start + "," + rowsPerPage;
		
		String mainQuery = "select * " + customQuery;
		ArrayList<Invoice> data = Crud.read(mainQuery);
		
		StringBuilder json = new StringBuilder(new Gson().toJson(data));
		json.deleteCharAt(json.length() - 1);
		String details = "{\"totalRows\": \"" + totalRows + "\"}";
		json.append(","+details+"]");
		
		resp.getWriter().print(json.toString());
	}
	
	
	@Override
	protected void service(HttpServletRequest arg0, HttpServletResponse arg1) throws ServletException, IOException {
		// To handle CORS Error
		arg1.setHeader("Access-Control-Allow-Origin", "*");
		arg1.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
		arg1.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
		super.service(arg0, arg1);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		
		if(req.getParameter("analytics") != null) {
			String clearDateFrom = req.getParameter("clearDateFrom");
			String clearDateTo = req.getParameter("clearDateTo");
			String dueDateFrom = req.getParameter("dueDateFrom");
			String dueDateTo = req.getParameter("dueDateTo");
			String baselineDateFrom = req.getParameter("baselineDateFrom");
			String baselineDateTo = req.getParameter("baselineDateTo");
			String invoiceCurr = req.getParameter("invoiceCurr");
			String query = "select * from winter_internship where ";
			boolean added = false;
			if (clearDateFrom != null && clearDateTo != null){
			    added = true;
			    query += "clear_date between '" + clearDateFrom + "' and '" + clearDateTo + "'";
			    
			}
			if (dueDateFrom != null && dueDateTo != null){
			    if(added) query += " and ";
			    else added = true;
			    
			    query += "due_in_date between '" + dueDateFrom + "' and '" + dueDateTo + "'";
			}
			if (baselineDateFrom != null && baselineDateTo != null){
			    if(added) query += " and ";
			    query += "baseline_create_date between '" + baselineDateFrom + "' and '" + baselineDateTo + "'";
			}
			if (invoiceCurr != null){
			    if(added) query += " and ";
			    query += "invoice_currency='" + invoiceCurr + "'";
			}
			
			ArrayList<Invoice> data = Crud.read(query);
			
			StringBuilder json = new StringBuilder(new Gson().toJson(data));
			
			resp.getWriter().print(json.toString());
		}
		else {
			fetchData(req, resp);			
		}
		
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String type = req.getParameter("type");
		
		BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
		
		String data = "";
		if(br != null){
			data = br.readLine();
		}
		
		if(type.equals("post")) {
			Invoice temp = new Gson().fromJson(data, Invoice.class);
			int res = Crud.create(temp);
			
			resp.setContentType("application/json");
			resp.setCharacterEncoding("UTF-8");
			
			resp.getWriter().print(res);
		}
		
		if(type.equals("delete")) {
			StringBuilder dataArray = new StringBuilder(data);
			dataArray.deleteCharAt(0);
			dataArray.deleteCharAt(dataArray.length() - 1);
			String[] values = dataArray.toString().split(",");
			ArrayList<Integer> list = new ArrayList<>();
			for(String val : values) {
				list.add(Integer.parseInt(val));
			}
			
			if(Crud.delete(list) == 0) {
				resp.sendError(HttpServletResponse.SC_EXPECTATION_FAILED, "");
			}
			
		}

	}


	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
		
		String data = "";
		if(br != null){
			data = br.readLine();
		}
		data = data.substring(2, data.length() - 2);
		
		String invoiceList[] = data.split("\\},\\{");
		ArrayList<Invoice> invList = new ArrayList<>();
		for (String str : invoiceList) {
			str = "{" + str + "}";
			invList.add(new Gson().fromJson(str, Invoice.class));
		}

		if (Crud.update(invList) == 0) {
			resp.sendError(HttpServletResponse.SC_EXPECTATION_FAILED, "");
		}

	}

}
