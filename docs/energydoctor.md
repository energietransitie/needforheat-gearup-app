# EnergyDoctor Documentation

This guide provides essential information for EnergyDoctors to set up NeedForHeat effectively and achieve your goals.

## Table of Contents

* [1. Energy Query](#1-energy-query)

## 1. Energy Query

Energy Queries are interactive questionnaires designed for users. These questionnaires gather information crucial for NeedForHeat's functionality. For example, a query might request a user's location to determine a privacy-preserving weather zone and transmit it securely to the server.

Certain Energy Queries require additional knowledge for optimal use. 

### 1.1. Building Profile (BAG)

The BuildingProfile energy query leverages Dutch BAG (Basisregistratie Adressen en Gebouwen) data to retrieve information about a user's residence. NeedForHeat can then perform calculations based on a formula defined within the [needforheat-server-api](https://github.com/energietransitie/needforheat-server-api).

#### 1.1.1. Formula-Based Calculations

Essentially, you can configure the app to compute values based on available data and a custom JavaScript formula. The formula can resemble this structure:

> x + y * q^p / (z - h)

The following table details the correspondence between each letter and its corresponding value retrieved from the [3DBAG API](https://docs.3dbag.nl/nl/delivery/webservices/#3dbag-api-3d):

| Letter | Attribute           |
|--------|---------------------|
| a  | b3_bag_bag_overlap      |
| b  | b3_bouwlagen            |
| c  | b3_h_dak_50p            |
| d  | b3_h_dak_70p            |
| e  | b3_h_dak_max            |
| f  | b3_h_dak_min            |
| g  | b3_h_maaiveld           |
| h  | b3_nodata_fractie_ahn3  |
| i  | b3_nodata_fractie_ahn4  |
| j  | b3_nodata_radius_ahn3   |
| k  | b3_nodata_radius_ahn4   |
| l  | b3_opp_buitenmuur       |
| m  | b3_opp_dak_plat         |
| n  | b3_opp_dak_schuin       |
| o  | b3_opp_grond            |
| p  | b3_opp_scheidingsmuur   |
| q  | b3_puntdichtheid_ahn3   |
| r  | b3_puntdichtheid_ahn4   |
| s  | b3_pw_datum             |
| t  | b3_rmse_lod12           |
| u  | b3_rmse_lod13           |
| v  | b3_rmse_lod22           |
| w  | b3_volume_lod12         |
| x  | b3_volume_lod13         |
| y  | b3_volume_lod22         |
| z  | oorspronkelijkbouwjaar  |
| aa | voorkomingidentificatie |

