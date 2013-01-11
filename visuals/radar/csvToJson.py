import os
import sys
import csv
import time
import json

f = open("ranking.csv", "r")
csv_file = csv.reader(f, delimiter=',')

keys = ( "rank", "brand", "technology", "search_nav", "customer_service", "product_page", "checkout", "account", "total_site" )

rows = []
row = 0

for col in csv_file:
	if row != 0:
		test =  { "test" : float(col[5]) }
		print test
		newrow = [ col[54], col[1], col[43], col[44], col[45], col[46], col[47], col[48], col[49] ]
		rows.append(newrow)
	row += 1

out = { "data" : [ dict(zip(keys, property)) for property in rows ] }
out = json.dumps(out)
# print out