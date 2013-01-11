import os
import sys
import csv
import time
import json
from operator import itemgetter
from math import ceil

total_mobile_site_sum = 0 
total_ios_sum = 0
total_mobile_innovation_sum = 0
mobile_total_sum = 0
facebook_sum = 0 
twitter_sum = 0 
youtube_sum = 0 
emerging_social_media_sum =0
social_media_total_sum =0 
search_sum = 0
web_advertising_innovation_total_sum = 0
user_generated_content_sum = 0 
email_marketing_sum = 0
digital_marketing_total_sum = 0
technology_sum= 0
search_nav_sum = 0 
customer_service_sum = 0
product_page_sum = 0
checkout_sum = 0
account_sum = 0
site_score_total_sum = 0


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
			"site_score_total" : r2(float(col[49])/6),
		}

		total_mobile_site_sum += r2(float(col[5]))
		total_ios_sum += r2(float(col[9]))
		total_mobile_innovation_sum += r2(float(col[12]))
		mobile_total_sum += r2(float(col[13])/4)
		facebook_sum += r2(float(col[15])/2)
		twitter_sum += r2(float(col[16]))
		youtube_sum += r2(float(col[17]))
		emerging_social_media_sum += r2(float(col[23]))
		social_media_total_sum += r2(float(col[24])/4)
		search_sum += r2(float(col[33])/3)
		web_advertising_innovation_total_sum += r2(float(col[36]))
		user_generated_content_sum += r2(float(col[37]))
		email_marketing_sum += r2(float(col[38]))
		digital_marketing_total_sum += r2(float(col[39])/6)
		technology_sum += r2(float(col[43]))
		search_nav_sum += r2(float(col[44]))
		customer_service_sum += r2(float(col[45]))
		product_page_sum += r2(float(col[46]))
		checkout_sum += r2(float(col[47]))
		account_sum += r2(float(col[48]))
		site_score_total_sum += r2(float(col[49])/6)

		newrow = { "rank" : int(col[54]), "brand" : col[1], "mobile" : mobile, "social_media" : social_media, "digital_marketing" : digital_marketing, "site" : site } 
		rows.append(newrow)

	row += 1

l = len(rows)

mobile_avg = { 
	"total_mobile_site" : r2(total_mobile_site_sum/l), 
	"total_ios" : r2(total_ios_sum/l), 
	"total_mobile_innovation" : r2(total_mobile_innovation_sum/l),
	"mobile_total" : r2(mobile_total_sum/l)
}

social_media_avg = {
	"facebook" : r2(facebook_sum/l),
	"twitter" : r2(twitter_sum/l),
	"youtube" : r2(youtube_sum/l),
	"emerging_social_media" : r2(emerging_social_media_sum/l),
	"social_media_total" : r2(social_media_total_sum/l)

}

digital_marketing_avg = {
	"search" : r2(search_sum/l),
	"web_advertising_innovation_total" : r2(web_advertising_innovation_total_sum/l),
	"user_generated_content" : r2(user_generated_content_sum/l),
	"email_marketing" : r2(email_marketing_sum/l),
	"digital_marketing_total" : r2(digital_marketing_total_sum/l)
}

site_avg = {
	"technology" : r2(technology_sum/l),
	"search_nav" : r2(search_nav_sum/l),
	"customer_service" : r2(customer_service_sum/l),
	"product_page" : r2(product_page_sum/l),
	"checkout" : r2(checkout_sum/l),
	"account" : r2(account_sum/l),
	"site_score_total" : r2(site_score_total_sum/l),
}

avgrow = { "rank" : "", "brand" : "Average", "mobile" : mobile_avg, "social_media" : social_media_avg, "digital_marketing" : digital_marketing_avg, "site" : site_avg } 
rows.append(avgrow)

newlist = sorted(rows, key=itemgetter('rank'))

out = { "data" : newlist }
out = json.dumps(out)
print out
