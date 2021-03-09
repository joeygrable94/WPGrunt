import os, csv, json, string, random
import subprocess
from pynpm import NPMPackage
cur_dir = os.path.dirname(os.path.realpath(__file__))

# outputs the working directory
# its contents (files + directory)
def listContentsIn( filepath='' ):
	print('from:', filepath)
	for (dirpath, dirnames, filenames) in os.walk(filepath):
		print('dir:', dirnames)
		print('file:', filenames)
		break

# import the data from a specified file
def getDataFromFile( filepath='' ):
	dfile	=	filepath.split('/')[-1]
	dext	=	dfile.split('.')[-1]
	data	=	[]
	# if file exists and has data in the file
	if os.path.isfile(filepath) and (os.path.getsize(filepath) > 0):
		# CSV files
		if dext == 'csv':
			with open(filepath, 'r') as csvfile:
				rawcsv	=	csv.reader(csvfile)
				data	=	rawcsv
		# JSON files
		elif dext == 'json':
			with open(filepath, 'r') as jsonfile:
				rawjson	=	json.load(jsonfile)
				data	=	rawjson
	# return data
	return data

# writes the given data obj to the supplied file
def writeDataToFile( filepath='', rawdata=[] ):
	dfile	=	filepath.split('/')[-1]
	dext	=	dfile.split('.')[-1]
	# if file exists and has data in the file
	# CSV files
	if dext == 'csv':
		with open(filepath, 'w+') as csvfile:
			writer = csv.writer(csvfile)
			for row in rawdata:
				writer.writerow(row)
			writer.close()
	# JSON files
	elif dext == 'json':
		with open(filepath, 'w+') as jsonfile:
			json.dump(rawdata, jsonfile, indent=4)
	# return data saved
	return True

# return a path string base on the Server Provider's protocal
def getProviderRootPath(provider, user, host):
	root_path = False
	if str(provider).lower() == 'dreamhost':
		root_path = '/home/%s/%s' % (user, host)
	elif str(provider).lower() == 'godaddy':
		root_path = '/home/%s/public_html/%s' % (user, host)
	if root_path:
		return root_path

# ask all the initial dev questions to make a proper build file
def askBuildQuestions():
	# local environment
	print( '---------- NOW SETTING: LOCAL VARS ----------' )
	local_host		=	input("LOCAL — website host name: ")
	local_host		=	local_host			or 'localhost'
	local_db_host	=	input("LOCAL — database host: ")
	local_db_host	=	local_db_host		or 'localhost'
	local_db_name	=	input("LOCAL — database name: ")
	local_db_name	=	local_db_name		or 'localdb'
	local_db_user	=	input("LOCAL — database username: ")
	local_db_user	=	local_db_user		or 'root'
	local_db_pass	=	input("LOCAL — database password: ")
	local_db_pass	=	local_db_pass		or 'root'
	local_access	=	input("LOCAL — is host secure \"https://\"? (yes or no) ")
	if local_access.lower() == '' or local_access.lower() == 'no':
		local_access = 'http://'
	elif local_access.lower() == 'yes':
		local_access = 'https://'
	# staging environment
	print( '\n---------- NOW SETTING: STAGING VARS ----------' )
	stage_host		=	input("STAGE — website host name: ")
	stage_host		=	stage_host			or 'SITEURL.src.pub'
	stage_provider	=	input("STAGE — server provider (default: dreamhost): ")
	stage_provider	=	stage_provider		or 'dreamhost'
	stage_ssh_user	=	input("STAGE — SSH username: ")
	stage_ssh_user	=	stage_ssh_user		or 'SSH_USER'
	stage_ssh_pass	=	input("STAGE — SSH password: ")
	stage_ssh_pass	=	stage_ssh_pass		or 'SSH_PASS'
	stage_db_host	=	input("STAGE — database host: ")
	stage_db_host	=	stage_db_host		or 'mysql.SITEURL.src.pub'
	stage_db_name	=	input("STAGE — database name: ")
	stage_db_name	=	stage_db_name		or 'SITEURL_db'
	stage_db_user	=	input("STAGE — database username: ")
	stage_db_user	=	stage_db_user		or 'DB_USER'
	stage_db_pass	=	input("STAGE — database password: ")
	stage_db_pass	=	stage_db_pass		or 'DB_PASSWORD'
	stage_access	=	input("STAGE — is host secure \"https://\"? (yes or no) ")
	if stage_access.lower() == '' or stage_access.lower() == 'no':
		stage_access = 'http://'
	elif stage_access.lower() == 'yes':
		stage_access = 'https://'
	# production environment
	print( '\n---------- NOW SETTING: PRODUCTION VARS ----------' )
	prod_host		=	input("PROD — website host name: ")
	prod_host		=	prod_host			or 'SITEURL.com'
	prod_provider	=	input("PROD — server provider (default = dreamhost): ")
	prod_provider	=	prod_provider		or 'dreamhost'
	prod_ssh_user	=	input("PROD — SSH username: ")
	prod_ssh_user	=	prod_ssh_user		or 'SSH_USER'
	prod_ssh_pass	=	input("PROD — SSH password: ")
	prod_ssh_pass	=	prod_ssh_pass		or 'SSH_PASS'
	prod_db_host	=	input("PROD — database host: ")
	prod_db_host	=	prod_db_host		or 'mysql.SITEURL.com'
	prod_db_name	=	input("PROD — database name: ")
	prod_db_name	=	prod_db_name		or 'SITEURL_db'
	prod_db_user	=	input("PROD — database username: ")
	prod_db_user	=	prod_db_user		or 'DB_USER'
	prod_db_pass	=	input("PROD — database password: ")
	prod_db_pass	=	prod_db_pass		or 'DB_PASSWORD'
	prod_access	=	input("PROD — is host secure \"https://\"? (yes or no) ")
	if prod_access.lower() == '' or prod_access.lower() == 'no':
		prod_access = 'http://'
	elif prod_access.lower() == 'yes':
		prod_access = 'https://'
	# wordpress vars
	wp_theme		=	input("Wordpress Theme Name (default = GC): ")
	wp_theme		=	wp_theme			or 'GC'
	print( '\n' )
	# construct json build file
	build_json = '%s/%s' % (cur_dir,'build.json')
	if os.path.exists( build_json ):
		build_data = getDataFromFile( build_json )
		# build vars
		build_data['wp_theme'] = wp_theme
		build_data['dev_stack'] = "./dev_stack"
		build_data['dist_stack'] = "./httpublic/wp-content/themes/%s/assets" % (wp_theme)
		# local build
		build_data['local']['root'] = cur_dir
		build_data['local']['backups'] = '%s/%s' % (cur_dir, 'backups')
		build_data['local']['site_dir'] = '%s/%s' % (cur_dir, 'httpublic')
		build_data['local']['dump_path'] = '%s/%s/%s' % (cur_dir, 'httpublic', 'dumps')
		build_data['local']['access'] = local_access
		build_data['local']['host'] = local_host
		build_data['local']['db_host'] = local_db_host
		build_data['local']['db_name'] = local_db_name
		build_data['local']['db_user'] = local_db_user
		build_data['local']['db_pass'] = local_db_pass
		# staging build
		stage_dir = getProviderRootPath(stage_provider, stage_ssh_user, stage_host)
		build_data['staging']['site_dir'] = stage_dir
		build_data['staging']['dump_path'] = '%s/%s' % (stage_dir, 'dumps')
		build_data['staging']['access'] = stage_access
		build_data['staging']['host'] = stage_host
		build_data['staging']['db_host'] = stage_db_host
		build_data['staging']['db_name'] = stage_db_name
		build_data['staging']['db_user'] = stage_db_user
		build_data['staging']['db_pass'] = stage_db_pass
		build_data['staging']['ssh_user'] = stage_ssh_user
		build_data['staging']['ssh_pass'] = stage_ssh_pass
		# production build
		prod_dir = getProviderRootPath(prod_provider, prod_ssh_user, prod_host)
		build_data['production']['site_dir'] = prod_dir
		build_data['production']['dump_path'] = '%s/%s' % (prod_dir, 'dumps')
		build_data['production']['host'] = prod_host
		build_data['production']['access'] = prod_access
		build_data['production']['db_host'] = prod_db_host
		build_data['production']['db_name'] = prod_db_name
		build_data['production']['db_user'] = prod_db_user
		build_data['production']['db_pass'] = prod_db_pass
		build_data['production']['ssh_user'] = prod_ssh_user
		build_data['production']['ssh_pass'] = prod_ssh_pass
		# write data to json file
		return build_data if writeDataToFile( build_json, build_data ) else False

# return a SALT string for a specific wp salt var
def wpSaltGenerator( size=64, chars=string.ascii_lowercase+string.ascii_uppercase+string.digits ):
	# do calculation
	return ''.join( random.choice(chars) for _ in range(size) )

# return a string of php text with a defined config variable
def returnDefinedPhpVar(state, line, config, var_name):
	new_line = ''
	# local env
	if state == 'LOCAL':
		if '$requested_link' in var_name:
			new_line = "if ( strpos($requested_link, '%s') ) {\n" % ( config['local']['host'] )
		else:
			new_line = "\tdefine( '%s', '%s' );\n" % ( var_name.upper(), config['local'][var_name] )
	# staging env
	elif state == 'STAGING':
		if '$requested_link' in var_name:
			new_line = "} else if ( strpos($requested_link, '%s') ) {\n" % ( config['staging']['host'] )
		elif 'WP_HOME' in line or 'WP_SITEURL' in line:
			wp_url = config['staging']['access']+config['staging']['host']
			new_line = "\tdefine( '%s', '%s' );\n" % ( var_name.upper(), wp_url )
		else:
			new_line = "\tdefine( '%s', '%s' );\n" % ( var_name.upper(), config['staging'][var_name] )
	# production env
	elif state == 'PRODUCTION':
		if '$requested_link' in var_name:
			new_line = "} else if ( strpos($requested_link, '%s') ) {\n" % ( config['production']['host'] )

		elif 'WP_HOME' in line or 'WP_SITEURL' in line:
			wp_url = config['production']['access']+config['production']['host']
			new_line = "\tdefine( '%s', '%s' );\n" % ( var_name.upper(), wp_url )
		else:
			new_line = "\tdefine( '%s', '%s' );\n" % ( var_name.upper(), config['production'][var_name] )
	# wp salts
	elif state == 'WPSALT':
		new_line = "define( '%s', '%s' );\n" % ( var_name.upper(), wpSaltGenerator() )
	# return php line
	return new_line
	
# grabs the wp-config.php file
# and prepends input config data
def updateWpConfigFile( config ):
	sampleconfig = '%s/%s/%s' % (cur_dir, 'httpublic', 'wp-config-sample.php')
	wpconfig = '%s/%s/%s' % (cur_dir, 'httpublic', 'wp-config.php')
	# if file exists and has data in the file
	if os.path.isfile(sampleconfig) and (os.path.getsize(sampleconfig) > 0):
		wpconfigout = []
		# read the sample config
		with open(sampleconfig, 'r+') as phpfile:
			ENV = None
			for line in phpfile:
				cur_line = line
				# check line environment
				ENV_VAR = '# ENV: '
				if ENV_VAR in line:
					env_index = line.index(ENV_VAR) + len(ENV_VAR)
					ENV = cur_line[ env_index : len(line)-1]
				# set vars in each environment
				find_and_define = [ '$requested_link', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'WP_HOME', 'WP_SITEURL', 'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT' ]
				for wp_var in find_and_define:
					if wp_var in cur_line:
						cur_line = returnDefinedPhpVar(ENV, line, config, wp_var.lower())
				# append line to outfile
				wpconfigout.append(cur_line)
		# convert sample wpconfig to output file
		wpconfigout = ''.join(wpconfigout)
	# if config file exists
	if len(wpconfigout) > 0 and os.path.isfile(wpconfig) and (os.path.getsize(wpconfig) > 0):
		# save new config file
		wpconfigfile = open(wpconfig, "w")
		wpconfigfile.write(wpconfigout)
		wpconfigfile.close()
		return True

# run the build, install wordpress git files,
# ask config questions, install npm packages
def runBuildProcesses():
	# build variables
	GIT_WP_GRUNT = 'https://github.com/joeygrable94/WPGrunt.git'
	# install WPGrunt in current folder
	try:
		subprocess.check_call(['git', 'clone', GIT_WP_GRUNT, '.'])
	except:
		print('wp grunt already cloned')
	# run build processes
	wp_grunt_build = askBuildQuestions()
	if updateWpConfigFile( wp_grunt_build ):
		# install Node + Grunt Packages )
		try:
			pkg = NPMPackage( '%s/%s' % (cur_dir, 'package.json') )
			if pkg.install():
				print('Node Packages installed.')
		except:
			print('ERROR: could not install Node Packages.')
		# return true
		return print('\nBuild Process Complete!')
	else:
		return print('\nCould not install node packages.\nPlease check files:\nbuild.json, package.json, wp-config.php')

# run the entire program
runBuildProcesses()
