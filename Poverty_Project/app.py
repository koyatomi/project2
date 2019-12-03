# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy import MetaData

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
#meta dat and base
# metadata = MetaData()
# metadata.reflect(db.engine, only=['poverty'])

# Base = automap_base(metadata=metadata)
# Base.prepare()

# Poverty = Base.classes.poverty


# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://mzedobeawmveaa:6988c0251dcc5057de82f185f796d31c7a7d58a94c7245ffa687ed1db2d41cfc@ec2-107-21-226-44.compute-1.amazonaws.com:5432/di0rlcvvaevqo"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

metadata = MetaData()
metadata.reflect(db.engine, only = ['poverty'])

Base = automap_base(metadata = metadata)
Base.prepare()

Poverty = Base.classes.poverty

# create route that renders index.html template
@app.route('/')
def h():
    return render_template('index.html')

@app.route("/api/poverty")
def home():
    stmt = db.session.query(Poverty).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    return jsonify(df.to_dict(orient = 'records'))


# Query the database and send the jsonified results
# @app.route("/api/poverty")
# def poverty():
#     stmt = db.session.query(Poverty).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     return jsonify(df.to_dict(orient = 'records'))
#     results = db.session.query(poverty).all()

#     code  = [result[0] for result in results]
#     year = [result[1] for result in results]
#     entity = [result[2] for result in results]
#     percentage = [result[3] for result in results]

#     poverty_data = [{
#         "code": code,
#         "year": year,
#         "entity": entity,
#         "percentage": percentage,
#         "marker": {
#             "size": 50,
#             "line": {
#                 "color": "rgb(8,8,8)",
#                 "width": 1
#             },
#         }
#     }]

#     return jsonify(poverty_data)


if __name__ == "__main__":
    app.run()
