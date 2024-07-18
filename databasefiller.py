##import pandas as pd
##
##pd.set_option('display.max_columns', None)
##df = pd.read_csv('TMDB_movie_dataset_v11.csv')
##wantedmovies = df.loc[(df["release_date"] <= "2024-07-16") & (df["release_date"] >= "1970-01-01") & (df["adult"] == False)].sort_values(by="popularity", ascending=False)
##wantedcolumns = wantedmovies[["id", "title", "runtime", "release_date", "overview", "budget", "revenue", "poster_path", "genres"]].dropna()
##final = wantedcolumns.head(15000)
##final.to_csv('movies.csv', sep=',', index=False, header=True, encoding='utf-8')

import mysql.connector
import csv

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="cinema_project"
)

mycursor = mydb.cursor()

csv_file_path = 'movies.csv'

genreIndex = {
    'Adventure': 12,
    'Fantasy':	14,
    'Animation': 16,
    'Drama': 18,
    'Horror': 27,
    'Action': 28,
    'Comedy': 35,
    'History': 36,
    'Western': 37,
    'Thriller': 53,
    'Crime': 80,
    'Documentary': 99,
    'Science Fiction': 878,
    'Mystery': 9648,
    'Music': 10402,
    'Romance': 10749,
    'Family': 10751,
    'War': 10752,
    'TV Movie': 10770
}

with open(csv_file_path, mode='r', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # Skip the header row
    for row in reader:
        
        genres = row[-1]
        genres = genres.split(', ')

        genreEntries = []
        for genre in genres:
            genreEntries.append([row[0],genreIndex[genre]])
        
        mycursor.execute("INSERT INTO movies (movie_id, title, runtime, release_date, overview, budget, revenue, poster_path) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", row[:-1])
        mycursor.executemany("INSERT INTO movie_genres (movie_id, genre_id) VALUES (%s, %s)", genreEntries)
        
mydb.commit()
print("Done")
