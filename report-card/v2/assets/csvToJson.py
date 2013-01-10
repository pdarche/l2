import os
import sys
import csv
import time
import json
from operator import itemgetter
from math import ceil


def r2(num):
	return ceil(num * 100)/100.0

f = open("fashion2012.csv", "r")
csv_file = csv.reader(f, delimiter=',', skipinitialspace=True)

rows = []
row = 0

for col in csv_file:
	if row != 0 and col[13] != '':

		mobile = { 
			"total_mobile_site" : r2(float(col[5])), 
			# "iphone" : col[6], 
			# "ipad" : col[7], 
			# "ios_funcitonality" : col[8], 
			"total_ios" : r2(float(col[9])), 
			# "geolocal" : col[10], 
			# "mobile_innovation" : col[11], 
			"total_mobile_innovation" : r2(float(col[12])),
			"mobile_total" : r2(float(col[13])/4)
		}

		social_media = {
			"facebook" : r2(float(col[15])/2),
			"twitter" : r2(float(col[16])),
			"youtube" : r2(float(col[17])),
			# "traditional" : col[18],
			# "pinterest" : col[19],
			# "tumblr" : col[20],
			# "instagram" : col[21],
			# "google_plus" : col[22],
			"emerging_social_media" : r2(float(col[23])),
			"social_media_total" : r2(float(col[24])/4)

		}

		digital_marketing = {
			# "traffic" : col[26],
			# "quantitative_search" : col[27],
			# "web_authority" : col[28],
			# "google" : col[29],
			# "bing" : col[30],
			# "mobile" : col[31],
			# "qualitative" : col[32],
			"search" : r2(float(col[33])/3),
			# "web_advertising" : col[34],
			# "innovation" : col[35],
			"web_advertising_innovation_total" : r2(float(col[36])),
			"user_generated_content" : r2(float(col[37])),
			"email_marketing" : r2(float(col[38])),
			"digital_marketing_total" : r2(float(col[39])/6)
		}

		site = {
			# "brand_translation_aesthetic" : col[41],
			# "brand_translation_messaging" : col[42],
			"technology" : r2(float(col[43])),
			"search_nav" : r2(float(col[44])),
			"customer_service" : r2(float(col[45])),
			"product_page" : r2(float(col[46])),
			"checkout" : r2(float(col[47])),
			"account" : r2(float(col[48])),
			"total_site_score" : r2(float(col[49])/6),
		}

		
		newrow = { "rank" : int(col[54]), "brand" : col[1], "mobile" : mobile, "social_media" : social_media, "digital_marketing" : digital_marketing, "site" : site } 
		rows.append(newrow)

	row += 1

newlist = sorted(rows, key=itemgetter('rank'))

out = { "data" : newlist }
out = json.dumps(out)
print out
