# take content and locale and put in a a jar file name actionlogger.jar jar cf jar-file input-file(s)
# create a directory chrome and place actionloogeer.jar into chrome
# copy: chrome, chrome.manifest, install.rdf, readme.txt into a zip file
# rename zip file to .xpi
import os
import shutil
from zipfile import ZipFile

jar = "actionlogger.jar"
if os.path.isfile(os.path.join(os.curdir, jar)):
  os.remove(os.path.join(os.curdir, jar))
os.system("jar cf %s ../content ../locale" % jar)

newdir = "chrome" 
if os.path.isdir(os.path.join(os.curdir, "chrome")):  
  os.remove(os.path.join(newdir, jar))
  os.removedirs(os.path.join(os.curdir, "chrome"))
os.mkdir(newdir)

os.rename(os.path.join(os.curdir, jar), os.path.join(newdir, jar))

packagename = "actionlogger.xpi"
if os.path.isfile(os.path.join(os.curdir, packagename)):
  os.remove(os.path.join(os.curdir, packagename))
package = ZipFile(os.path.join(os.curdir, packagename), 'w')
package.write(os.path.join(newdir, jar))
package.write(os.path.join(os.curdir, "chrome.manifest"))
package.write(os.path.join(os.pardir, "install.rdf"))
package.write(os.path.join(os.pardir, "readme.txt"))
package.close()

result = ZipFile(os.path.join(os.curdir, packagename), 'r')
if result.testzip() is None:
  print ".xpi is created successfully"
  
# clean up
os.remove(os.path.join(newdir, jar))
os.removedirs(os.path.join(os.curdir, "chrome"))