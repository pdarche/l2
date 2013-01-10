import os
import sys
import csv
import time
import json
from operator import itemgetter

f = open("fashion2012.csv", "r")
csv_file = csv.reader(f, delimiter=',')

rows = []
row = 0

for col in csv_file:
	if row != 0:
		mobile = { 
			"total_mobile_site" : col[5], 
			"iphone" : col[6], 
			"ipad" : col[7], 
			"ios_funcitonality" : col[8], 
			"total_ios": col[9], 
			"geolocal" : col[10], 
			"mobile_innovation" : col[11], 
			"total_mobile_innovation" : col[12],
			"mobile_total" : col[13] 
		}

		social_media = {
			"facebook" : col[15],
			"twitter" : col[16],
			"youtube" : col[17],
			"traditional" : col[18],
			"pinterest" : col[19],
			"tumblr" : col[20],
			"instagram" : col[21],
			"google_plus" : col[22],
			"emerging_social_media" : col[23],
			"social_media_total" : col[24]

		}

		digital_marketing = {
			"traffic" : col[26],
			"quantitative_search" : col[27],
			"web_authority" : col[28],
			"google" : col[29],
			"bing" : col[30],
			"mobile" : col[31],
			"qualitative" : col[32],
			"search" : col[33],
			"web_advertising" : col[34],
			"innovation" : col[35],
			"web_advertising_innovation_total" : col[36],
			"user_generated_content" : col[37],
			"email_marketing" : col[38],
			"digital_marketing_total" : col[39]
		}

		site = {
			"brand_translation_aesthetic" : col[41],
			"brand_translation_messaging" : col[42],
			"technology" : col[43],
			"search_nav" : col[44],
			"customer_service" : col[45],
			"product_page" : col[46],
			"checkout" : col[47],
			"account" : col[48],
			"total_site_score" : col[49],
			"site_total" : col[50]
		}

		if col[54] != '':
			newrow = { "rank" : int(col[54]), "brand" : col[1], "mobile" : mobile, "social_media" : social_media, "digital_marketing" : digital_marketing, "site" : site } 
			rows.append(newrow)

	row += 1

# newlist = sorted(rows, key=lambda k: k['rank']) 

newlist = sorted(rows, key=itemgetter('rank'))

out = { "data" : newlist }
out = json.dumps(out)
print out

