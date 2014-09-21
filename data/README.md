# So you want to contribute to Research?

## First the worst - What you need

Yeah, we move fast, but we don't break things. Here's what you'll need.

- Name of the Coffee Shop
- Its address
- Yeah and that includes the zip, state, and country as well
- Most importantly, the coordinates of the location
    - In latitude
    - Longitude
    - And zoom (more on this in a bit)

To find the coordinates of the location, just fire up google maps and search for the coffee shop. When you find the coffee shop, you should notice a string of a similar pattern in the url.

`@37.7921595,-122.4153814,12z`

The first float/decimal stands for the latitude, the second for the longitude, and the third for the zoom. You can mess around with the Google Maps gui until you get the correct zoom.

## Second the best - The breakdown

The data contains a hierarchy of three levels. First and foremost, we have the __regions__. These can represent (and currently do) represent states, but we can also extend them to represent other countries as well (if there is a need to).

Next, we have the __subregions__. These should represent smaller subsets of their respective regions (currently, they represent cities within their respective states).

Finally, we have the __points of interests__, or __poi__. This should be where you input most of your data (unless you plan on adding another subregion or another region).

## Third the turd - Adding a point of interest

The skeleton for a point of interest goes as follows:

    {
        id
        name
        address1
        address2
        city
        state
        zip
        country
        coords {
            lat
            long
            zoom
        }
    }

Of course, everything should be in valid json, but I'm just too lazy to be typing in those quotes right now. __One thing of importance though, the id should just be a unique slug identifier for that particular point of interest. An easy way to do this is to just snake case the name of the point of interest. THIS MUST BE UNIQUE ACROSS ALL POINTS OF INTERESTS REGARDLESS OF WHICH SUBREGION OR REGION THEY'RE IN__.

## Fourth the... I forgot what's fourth - Adding a subregion

So being the little twat that you are, you want to add a subregion. Easy enough. Here's the skeleton:

    {
        id
        name
        coords {
            lat
            long
            zoom
        }
        poiData [
            -- array of poi --
        ]
    }

Once again, everything should be in valid json. The coordinates for the subregions should be retrieved from Google Maps in a similar fashion. Just mess around with the GUI until you get a good mapping.

## Fifth - Adding a region

This is not currently webscale. No easy way to do this. I guess you can try just adding a region and messing with the coordinates until you get it right, but it uses D3 data instead of Google Maps so it will be pretty hard to determine what that data is. Anyway, here's the skeleton

    {
        id
        name
        coords {
            x
            y
            scale
        }
        subregions [
            -- array of subregions --
        ]
    }

In the coordinates object, x stands for the x-offset, y stands for the y-offset, and scale stands for how much you want to zoom into the map. 

__This only works for the US right now.__
