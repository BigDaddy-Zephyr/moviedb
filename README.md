
# Libraries used #
<ul>
<li>Express</li> 
<li>Sequelize</li>
<li>pg</li></ul>

 ## APIs ##


<p>/byratinggenreyear(x-www-form-url-encoded)
Body{
genre:
ratinghigher:
ratinglower:
startyear:
endyear:}
</p>
<p>It returns the movies of a particular genre with Rating between ratinglower and rating higher and between years startyear and endyear</p>
