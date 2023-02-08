PROJECTNAME = frontend-medicine

start:
	docker build -t $(PROJECTNAME) -f Dockerfile .
	docker run --name $(PROJECTNAME) -d --restart=always -p 4480:4480 $(PROJECTNAME)

stop:
	docker rm -f $(PROJECTNAME)
	docker rmi $(PROJECTNAME)

restart:
	make stop
	make start

update:
	git pull
	make restart